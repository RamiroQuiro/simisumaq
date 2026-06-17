import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { comision } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id) {
    const rows = await db.select().from(comision).where(eq(comision.id, parseInt(id)));
    const item = rows[0];
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = await db.select().from(comision);
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const cargo = formData.get("cargo") as string;
  const nombre = formData.get("nombre") as string;

  if (!cargo || !nombre) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  await db.insert(comision).values({ cargo, nombre });
  return redirect("/admin/comision");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  await db.update(comision).set(data).where(eq(comision.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  await db.delete(comision).where(eq(comision.id, parseInt(id)));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
