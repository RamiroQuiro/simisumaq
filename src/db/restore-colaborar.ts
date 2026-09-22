import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { configuracion } from "./schema";
import { eq } from "drizzle-orm";

const client = createClient({ url: "file:data/simisumaq.db" });
const db = drizzle(client);

const colaborarConfig = {
  titulo: "Formas de Colaborar",
  texto: "Hay muchas formas de contribuir a nuestra misión. Cada acción cuenta y juntos podemos transformar más vidas.",
  formas: [
    {
      titulo: "Donación Única",
      descripcion: "Haz una diferencia inmediata con una donación única. Puede cambiar una vida para siempre.",
      monto: "$150.000",
      action: "Donar Ahora",
      href: "https://wa.me/543855063501?text=Hola,%20quiero%20hacer%20una%20donaci%C3%B3n%20%C3%BAnica",
    },
    {
      titulo: "Donación Mensual",
      descripcion: "Únete a nuestra comunidad de patrocinadores mensuales y ayudanos a mantener nuestros programas activos todo el año.",
      monto: "$1.500 / $16.000 anual",
      action: "Ser Patrocinador",
      href: "https://wa.me/543855063501?text=Hola,%20quiero%20ser%20patrocinador",
    },
    {
      titulo: "Voluntariado",
      descripcion: "Profesionales de diferentes áreas pueden unirse a nuestras misiones y apoyar en diferentes actividades.",
      monto: "",
      action: "Únete al Equipo",
      href: "https://wa.me/543855063501?text=Hola,%20quiero%20unirme%20como%20voluntario",
    },
    {
      titulo: "Comparte Nuestra Causa",
      descripcion: "Ayúdanos a llegar a más personas compartiendo nuestro trabajo en redes sociales.",
      monto: "",
      action: "Compartir",
      href: "https://wa.me/543855063501?text=Hola,%20quiero%20ayudar%20a%20difundir%20su%20causa",
    },
  ],
};

async function restore() {
  const value = JSON.stringify(colaborarConfig);
  const existing = await db.select().from(configuracion).where(eq(configuracion.key, "colaborar"));

  if (existing.length > 0) {
    await db.update(configuracion).set({ value }).where(eq(configuracion.key, "colaborar"));
    console.log("✅ Colaborar restaurado");
  } else {
    await db.insert(configuracion).values({ key: "colaborar", value });
    console.log("✅ Colaborar insertado");
  }
}

restore().catch(console.error);
