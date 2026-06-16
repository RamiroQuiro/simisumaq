import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { encodeSession } from "../../../middleware/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return redirect("/admin/login?error=missing");
  }

  const user = db.select().from(users).where(eq(users.username, username)).get();

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return redirect("/admin/login?error=invalid");
  }

  const sessionToken = encodeSession(user.id);
  cookies.set("session", sessionToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return redirect("/admin");
};
