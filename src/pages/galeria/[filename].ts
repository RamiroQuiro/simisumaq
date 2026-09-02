import type { APIRoute } from "astro";
import { readFileSync, existsSync } from "fs";
import { resolve, extname } from "path";

const UPLOAD_DIR = resolve(process.cwd(), "data/galeria");

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".tiff": "image/tiff",
};

export const GET: APIRoute = async ({ params }) => {
  const { filename } = params;

  if (!filename || filename.includes("/") || filename.includes("\\")) {
    return new Response("Not found", { status: 404 });
  }

  const filepath = resolve(UPLOAD_DIR, filename);

  if (!existsSync(filepath)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = extname(filename).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const buffer = readFileSync(filepath);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};