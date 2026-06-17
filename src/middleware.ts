import { defineMiddleware } from "astro:middleware";
import { db } from "./db/client";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const SESSION_SECRET = process.env.SESSION_SECRET || "simisumaq-secret-2024";

function decodeSession(token: string): { userId: number } | null {
  try {
    const decoded = atob(token);
    const [userId, secret] = decoded.split(":");
    if (secret !== SESSION_SECRET) return null;
    return { userId: parseInt(userId, 10) };
  } catch {
    return null;
  }
}

export function encodeSession(userId: number): string {
  return btoa(`${userId}:${SESSION_SECRET}`);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname.startsWith("/admin")) {
    if (url.pathname === "/admin/login") {
      return next();
    }

    const sessionCookie = context.cookies.get("session")?.value;
    if (!sessionCookie) {
      return context.redirect("/admin/login");
    }

    const session = decodeSession(sessionCookie);
    if (!session) {
      return context.redirect("/admin/login");
    }

    const rows = await db.select().from(users).where(eq(users.id, session.userId));
    if (!rows[0]) {
      return context.redirect("/admin/login");
    }

    context.locals.user = rows[0];
  }

  return next();
});
