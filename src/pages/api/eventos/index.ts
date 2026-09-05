import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { eventos } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";

const MAX_IMGS_PER_EVENT = 20;
const MAX_IMGS_TOTAL = 300;

async function countTotalImages(): Promise<number> {
  const rows = await db.select({ imagenes: eventos.imagenes }).from(eventos);
  let total = 0;
  for (const row of rows) {
    try {
      const imgs = JSON.parse(row.imagenes || "[]");
      total += Array.isArray(imgs) ? imgs.length : 0;
    } catch {}
  }
  return total;
}

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const rows = await db.select().from(eventos).where(eq(eventos.id, parseInt(id)));
    const item = rows[0];
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = await db.select().from(eventos).orderBy(desc(eventos.fechaISO));
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const titulo = formData.get("titulo") as string;
  const fecha = formData.get("fecha") as string;
  const fechaISO = formData.get("fechaISO") as string;
  const descripcion = formData.get("descripcion") as string;
  const participantes = formData.get("participantes") as string;
  const imagenesRaw = formData.get("imagenes") as string || "[]";
  const cover = formData.get("cover") as string || null;

  if (!titulo || !fecha || !descripcion || !participantes) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
  }

  let imagenes: string[];
  try {
    imagenes = JSON.parse(imagenesRaw);
  } catch {
    imagenes = [];
  }

  if (imagenes.length > MAX_IMGS_PER_EVENT) {
    return new Response(
      JSON.stringify({ error: `Máximo ${MAX_IMGS_PER_EVENT} fotos por evento.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const total = await countTotalImages();
  if (total + imagenes.length > MAX_IMGS_TOTAL) {
    return new Response(
      JSON.stringify({ error: `Límite total de ${MAX_IMGS_TOTAL} fotos alcanzado. Eliminá imágenes de otros eventos.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  await db.insert(eventos).values({ titulo, fecha, fechaISO: fechaISO || null, descripcion, participantes, imagenes: JSON.stringify(imagenes), cover: cover || null });
  return redirect("/admin/eventos");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { titulo, fecha, fechaISO, descripcion, participantes, imagenes, cover } = data;

  if (!titulo || !fecha || !descripcion || !participantes) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
  }

  let imgs: string[] = [];
  if (imagenes) {
    try {
      imgs = typeof imagenes === "string" ? JSON.parse(imagenes) : imagenes;
    } catch {
      imgs = [];
    }
  }

  if (imgs.length > MAX_IMGS_PER_EVENT) {
    return new Response(
      JSON.stringify({ error: `Máximo ${MAX_IMGS_PER_EVENT} fotos por evento.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const rows = await db.select({ imagenes: eventos.imagenes }).from(eventos).where(eq(eventos.id, parseInt(id)));
  const currentImgs = rows[0] ? (() => { try { return JSON.parse(rows[0].imagenes || "[]"); } catch { return []; } })() : [];
  const otherTotal = (await countTotalImages()) - currentImgs.length;
  if (otherTotal + imgs.length > MAX_IMGS_TOTAL) {
    return new Response(
      JSON.stringify({ error: `Límite total de ${MAX_IMGS_TOTAL} fotos alcanzado. Eliminá imágenes de otros eventos.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  await db.update(eventos).set({
    titulo,
    fecha,
    fechaISO: fechaISO || null,
    descripcion,
    participantes,
    imagenes: JSON.stringify(imgs),
    cover: cover || null,
  }).where(eq(eventos.id, parseInt(id)));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  await db.delete(eventos).where(eq(eventos.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
