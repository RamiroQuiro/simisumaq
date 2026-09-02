import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { configuracion } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const key = url.searchParams.get("key");
  if (!key) {
    const items = await db.select().from(configuracion);
    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const rows = await db.select().from(configuracion).where(eq(configuracion.key, key));
  const item = rows[0];
  if (!item) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(item), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const { key, value } = await request.json();

  if (!key || value === undefined) {
    return new Response(JSON.stringify({ error: "Missing key or value" }), { status: 400 });
  }

  const existing = await db.select().from(configuracion).where(eq(configuracion.key, key));
  if (existing.length > 0) {
    await db.update(configuracion).set({ value }).where(eq(configuracion.key, key));
  } else {
    await db.insert(configuracion).values({ key, value });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};