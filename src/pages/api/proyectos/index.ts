import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { proyectos } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const item = db.select().from(proyectos).where(eq(proyectos.id, parseInt(id))).get();
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = db.select().from(proyectos).all();
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const resultados = formData.get("resultados") as string;
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;
  const orden = parseInt(formData.get("orden") as string || "99");

  if (!title || !description || !resultados || !icon || !color) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  db.insert(proyectos).values({ title, description, resultados, icon, color, orden }).run();
  return redirect("/admin/proyectos");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  db.update(proyectos).set(data).where(eq(proyectos.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  db.delete(proyectos).where(eq(proyectos.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
