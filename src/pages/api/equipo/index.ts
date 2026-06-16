import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { equipo } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const item = db.select().from(equipo).where(eq(equipo.id, parseInt(id))).get();
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = db.select().from(equipo).all();
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const nombre = formData.get("nombre") as string;
  const cargo = formData.get("cargo") as string;
  const foto = formData.get("foto") as string || null;
  const detalle = formData.get("detalle") as string || null;

  if (!nombre || !cargo) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  db.insert(equipo).values({ nombre, cargo, foto, detalle }).run();
  return redirect("/admin/equipo");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  db.update(equipo).set(data).where(eq(equipo.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  db.delete(equipo).where(eq(equipo.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
