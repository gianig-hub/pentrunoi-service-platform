import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUploadsDir } from "@/lib/uploads";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params;

  const file = await prisma.uploadedFile.findUnique({
    where: { id }
  });

  if (!file || file.visibility !== "PUBLIC") {
    return new NextResponse("Not found", { status: 404 });
  }

  const uploadsDir = path.resolve(getUploadsDir());
  const filePath = path.resolve(uploadsDir, file.path);

  if (!filePath.startsWith(uploadsDir)) {
    return new NextResponse("Invalid file path", { status: 400 });
  }

  try {
    const data = await readFile(filePath);

    return new NextResponse(data, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Length": String(file.sizeBytes),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
