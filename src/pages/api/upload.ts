import type { APIRoute } from "astro";
import { writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { resolve, extname, join } from "path";
import sharp from "sharp";

const UPLOAD_DIR = resolve(process.cwd(), "public/galeria");
const MAX_INPUT_SIZE = 15 * 1024 * 1024; // Permite hasta 15MB antes de optimizar
const MAX_TOTAL_STORAGE = 1000 * 1024 * 1024; // 1GB total
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/tiff",
  "image/heic",
  "image/heif"
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".tiff", ".heic", ".heif"];

const MAX_WIDTH = 1920; // Ancho máximo en px
const WEBP_QUALITY = 80; // Calidad WebP (80% ofrece excelente balance entre nitidez y peso mínimo)

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

    if (file.size > MAX_INPUT_SIZE) {
      return new Response(
        JSON.stringify({ error: `El archivo supera el límite máximo de ${MAX_INPUT_SIZE / 1024 / 1024}MB` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return new Response(
        JSON.stringify({ error: "Tipo de archivo no permitido. Formatos aceptados: JPG, PNG, WebP, GIF, SVG, AVIF" }),
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

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let finalBuffer: Buffer = inputBuffer;
    let finalExt = ext;

    // Procesamiento y optimización con Sharp
    if (ext === ".svg") {
      finalBuffer = inputBuffer;
      finalExt = ".svg";
    } else {
      try {
        finalExt = ".webp";
        finalBuffer = await sharp(inputBuffer)
          .rotate() // Corregir automáticamente la orientación EXIF de fotos de celular
          .resize({
            width: MAX_WIDTH,
            withoutEnlargement: true, // No agrandar imágenes pequeñas
          })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
      } catch (err) {
        console.error("Error al comprimir la imagen con sharp, guardando original:", err);
        finalBuffer = inputBuffer;
        finalExt = ext;
      }
    }

    const timestamp = Date.now();
    const safeBaseName = file.name
      .replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "_")
      .replace(/_+/g, "_");

    const filename = `${timestamp}-${safeBaseName}${finalExt}`;
    const filepath = resolve(UPLOAD_DIR, filename);

    writeFileSync(filepath, finalBuffer);

    const newUsage = getDirSize(UPLOAD_DIR);
    const originalSizeStr = formatBytes(file.size);
    const compressedSizeStr = formatBytes(finalBuffer.length);
    const usageMB = (newUsage / 1024 / 1024).toFixed(1);

    return new Response(
      JSON.stringify({
        url: `/galeria/${filename}`,
        filename,
        originalSize: originalSizeStr,
        compressedSize: compressedSizeStr,
        storageUsed: `${usageMB}MB`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error en POST /api/upload:", err);
    return new Response(
      JSON.stringify({ error: "Error interno al procesar y guardar la imagen" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

