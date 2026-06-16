import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { galeria } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const item = db.select().from(galeria).where(eq(galeria.id, parseInt(id))).get();
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = db.select().from(galeria).all();
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
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  db.insert(galeria).values({ nombre, path, categoria }).run();
  return redirect("/admin/galeria");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  db.update(galeria).set(data).where(eq(galeria.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  db.delete(galeria).where(eq(galeria.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
