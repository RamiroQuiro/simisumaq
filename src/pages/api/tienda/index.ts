import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { tienda } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  const all = url.searchParams.get("all");

  if (id) {
    const item = db.select().from(tienda).where(eq(tienda.id, parseInt(id))).get();
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  }

  let items;
  if (all === "true") {
    items = db.select().from(tienda).all();
  } else {
    items = db.select().from(tienda).where(eq(tienda.active, true)).all();
  }

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const image = formData.get("image") as string;

  if (!name || !description || isNaN(price) || !image) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  db.insert(tienda).values({ name, description, price, image }).run();
  return redirect("/admin/tienda");
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const data = await request.json();
  db.update(tienda).set(data).where(eq(tienda.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  db.delete(tienda).where(eq(tienda.id, parseInt(id))).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
