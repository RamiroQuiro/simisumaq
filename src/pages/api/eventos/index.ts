import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { eventos } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const item = db.select().from(eventos).where(eq(eventos.id, parseInt(id))).get();
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = db.select().from(eventos).orderBy(desc(eventos.fechaISO)).all();
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

  if (!titulo || !fecha || !descripcion || !participantes) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  let imagenes: string[];
  try {
    imagenes = JSON.parse(imagenesRaw);
  } catch {
    imagenes = [];
  }

  db.insert(eventos).values({ titulo, fecha, fechaISO: fechaISO || null, descripcion, participantes, imagenes: JSON.stringify(imagenes) }).run();
  return redirect("/admin/eventos");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  db.update(eventos).set(data).where(eq(eventos.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  db.delete(eventos).where(eq(eventos.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
