import type { APIRoute } from "astro";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const UPLOAD_DIR = resolve(process.cwd(), "data/recursos");

export const GET: APIRoute = async ({ params }) => {
  const { filename } = params;

  if (!filename || filename.includes("/") || filename.includes("\\")) {
    return new Response("Not found", { status: 404 });
  }

  const filepath = resolve(UPLOAD_DIR, filename);

  if (!existsSync(filepath)) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = readFileSync(filepath);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
