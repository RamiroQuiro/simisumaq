import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { servicios } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const rows = await db.select().from(servicios).where(eq(servicios.id, parseInt(id)));
    const item = rows[0];
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = await db.select().from(servicios);
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const itemsStr = formData.get("items") as string;
  const orden = parseInt(formData.get("orden") as string || "99");
  const cover = formData.get("cover") as string || null;

  if (!titulo || !descripcion) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const items = itemsStr ? itemsStr.split("\n").map(s => s.trim()).filter(Boolean) : [];
  await db.insert(servicios).values({ titulo, descripcion, items: JSON.stringify(items), orden, cover: cover || null });
  return redirect("/admin/servicios");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  await db.update(servicios).set(data).where(eq(servicios.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  await db.delete(servicios).where(eq(servicios.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
