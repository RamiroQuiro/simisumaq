import type { APIRoute } from "astro";

const SITE = "https://asociacionsimisumaq.org";
const pages = [
  "/",
  "/como-ayudar",
  "/contacto",
  "/equipo",
  "/eventos",
  "/galeria",
  "/proyectos",
  "/que-hacemos",
  "/sobre-nosotros",
  "/tienda",
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();

  const urls = pages
    .map(
      (path) => `
  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
