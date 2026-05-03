import path from "node:path";

export function getUploadsDir() {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
}

export function getUploadPath(...parts: string[]) {
  return path.join(getUploadsDir(), ...parts);
}
