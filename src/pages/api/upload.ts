import type { APIRoute } from "astro";
import { writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { resolve, extname, join } from "path";

const UPLOAD_DIR = resolve(process.cwd(), "public/galeria");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB por archivo
const MAX_TOTAL_STORAGE = 500 * 1024 * 1024; // 500MB total
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

function getDirSize(dir: string): number {
  let total = 0;
  if (!existsSync(dir)) return 0;
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      total += getDirSize(fullPath);
    } else {
      total += stat.size;
    }
  }
  return total;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No se envió ningún archivo" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (file.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: `El archivo supera el límite de ${MAX_SIZE / 1024 / 1024}MB` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const currentUsage = getDirSize(UPLOAD_DIR);
    if (currentUsage + file.size > MAX_TOTAL_STORAGE) {
      const remainingMB = ((MAX_TOTAL_STORAGE - currentUsage) / 1024 / 1024).toFixed(1);
      return new Response(
        JSON.stringify({ error: `Almacenamiento lleno. Quedan ${remainingMB}MB disponibles. Eliminá archivos viejos desde el admin.` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Tipo de archivo no permitido. Solo se aceptan: jpg, png, webp, gif" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return new Response(
        JSON.stringify({ error: "Extensión de archivo no permitida" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "_")
      .replace(/_+/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const filepath = resolve(UPLOAD_DIR, filename);

    writeFileSync(filepath, buffer);

    const newUsage = getDirSize(UPLOAD_DIR);
    const usageMB = (newUsage / 1024 / 1024).toFixed(1);

    return new Response(
      JSON.stringify({ url: `/galeria/${filename}`, filename, storageUsed: `${usageMB}MB` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error al procesar el archivo" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
