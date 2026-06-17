import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { encodeSession } from "../../../middleware";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return redirect("/admin/login?error=missing");
  }

  const rows = await db.select().from(users).where(eq(users.username, username));
  const user = rows[0];

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return redirect("/admin/login?error=invalid");
  }

  const sessionToken = encodeSession(user.id);
  cookies.set("session", sessionToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return redirect("/admin");
};
