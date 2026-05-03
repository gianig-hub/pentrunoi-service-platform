import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUploadsDir } from "@/lib/uploads";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export default async function RepairUploadsPage({ params }: PageProps) {
  const { id } = await params;

  const repair = await prisma.repairCase.findUnique({
    where: { id },
    include: {
      customer: true,
      uploads: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!repair) {
    notFound();
  }

  const repairId = repair.id;
  const repairTrackingId = repair.trackingId;

  async function uploadFile(formData: FormData) {
    "use server";

    const rawFile = formData.get("file");

    if (!(rawFile instanceof File) || rawFile.size === 0) {
      throw new Error("No file uploaded.");
    }

    const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || "10");
    const maxBytes = maxUploadMb * 1024 * 1024;

    if (rawFile.size > maxBytes) {
      throw new Error(`File is too large. Maximum allowed size is ${maxUploadMb} MB.`);
    }

    const visibility = textValue(formData, "visibility") === "PUBLIC" ? "PUBLIC" : "PRIVATE";
    const description = textValue(formData, "description");

    const originalName = rawFile.name || "upload";
    const filename = `${crypto.randomUUID()}-${safeFileName(originalName) || "file"}`;
    const relativeDir = path.join("repair-cases", repairId);
    const relativePath = path.join(relativeDir, filename);

    const uploadDir = path.join(getUploadsDir(), relativeDir);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await rawFile.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    await prisma.uploadedFile.create({
      data: {
        repairCaseId: repairId,
        filename,
        originalName,
        mimeType: rawFile.type || "application/octet-stream",
        sizeBytes: rawFile.size,
        path: relativePath,
        visibility,
        description: description || null
      }
    });

    await prisma.changelogEntry.create({
      data: {
        version: "0.1.0-dev",
        type: "FEATURE",
        module: "Uploads",
        title: `Repair file uploaded: ${repairTrackingId}`,
        description: `A ${visibility.toLowerCase()} file was uploaded for repair case ${repairTrackingId}.`,
        status: "DONE"
      }
    });

    revalidatePath(`/admin/repairs/${repairId}`);
    revalidatePath(`/admin/repairs/${repairId}/uploads`);
    revalidatePath(`/status/${repairTrackingId}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href={`/admin/repairs/${repair.id}`} className="text-sm font-medium text-slate-600">
        ← Back to repair case
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Uploads
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Files for {repair.trackingId}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Încarcă poze sau documente pentru lucrare. Fișierele PRIVATE rămân doar în admin.
          Fișierele PUBLIC pot apărea pe pagina de status.
        </p>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Upload file</h2>

        <form action={uploadFile} className="mt-6 space-y-5">
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-slate-700">
              File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              required
              accept="image/*,.pdf"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-slate-700">
              Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              defaultValue="PRIVATE"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="PRIVATE">Private — admin only</option>
              <option value="PUBLIC">Public — visible on status page</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Ex: poză înainte de reparație, test temperatură, piesă înlocuită..."
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Upload
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Uploaded files</h2>

        {repair.uploads.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No files uploaded yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {repair.uploads.map((file) => (
              <article key={file.id} className="rounded-2xl border border-slate-200 p-4">
                {file.mimeType.startsWith("image/") && file.visibility === "PUBLIC" ? (
                  <img
                    src={`/files/${file.id}`}
                    alt={file.description || file.originalName}
                    className="mb-4 max-h-64 w-full rounded-xl object-cover"
                  />
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">{file.originalName}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {file.visibility} · {file.mimeType} · {formatSize(file.sizeBytes)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(file.createdAt)}</p>
                  </div>

                  {file.visibility === "PUBLIC" ? (
                    <Link
                      href={`/files/${file.id}`}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900"
                    >
                      View
                    </Link>
                  ) : null}
                </div>

                {file.description ? (
                  <p className="mt-3 text-sm text-slate-700">{file.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
