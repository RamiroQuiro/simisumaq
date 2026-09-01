import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { galeria } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const rows = await db.select().from(galeria).where(eq(galeria.id, parseInt(id)));
    const item = rows[0];
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = await db.select().from(galeria);
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre = formData.get("nombre") as string;
  const path = formData.get("path") as string;
  const categoria = formData.get("categoria") as string || null;

  if (!nombre || !path) {
    return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), { status: 400 });
  }

  const existing = await db.select().from(galeria);
  if (existing.length >= 60) {
    return new Response(
      JSON.stringify({ error: "Límite alcanzado: La galería admite un máximo de 60 fotos. Eliminá imágenes viejas antes de agregar nuevas." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  await db.insert(galeria).values({ nombre, path, categoria });
  return redirect("/admin/galeria");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  await db.update(galeria).set(data).where(eq(galeria.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  await db.delete(galeria).where(eq(galeria.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
