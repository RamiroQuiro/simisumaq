import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { recursos } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";

const UPLOAD_DIR = resolve(process.cwd(), "data/recursos");

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const rows = await db.select().from(recursos).where(eq(recursos.id, parseInt(id)));
    const item = rows[0];
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = await db.select().from(recursos).orderBy(desc(recursos.fecha));
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { titulo, descripcion, archivo, categoria } = data;

  if (!titulo || !archivo) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios (título y archivo)" }), { status: 400 });
  }

  const now = new Date();
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const fecha = `${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}`;

  await db.insert(recursos).values({
    titulo,
    descripcion: descripcion || null,
    archivo,
    categoria: categoria || null,
    fecha,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const rows = await db.select().from(recursos).where(eq(recursos.id, parseInt(id)));
  const item = rows[0];

  if (item) {
    const filename = item.archivo.replace("/recursos/", "");
    const filepath = resolve(UPLOAD_DIR, filename);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
    }
  }

  await db.delete(recursos).where(eq(recursos.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
