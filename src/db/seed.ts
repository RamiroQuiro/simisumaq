import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { users, equipo, eventos, proyectos, galeria, tienda, testimonios, servicios, comision, configuracion } from "./schema";
import { resolve } from "path";
import { readFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import bcrypt from "bcryptjs";

const client = createClient({ url: "file:data/simisumaq.db" });
const db = drizzle(client);

const dataDir = resolve(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

function readJSON(relativePath: string) {
  const raw = readFileSync(resolve(process.cwd(), relativePath), "utf-8");
  return JSON.parse(raw);
}

async function seed() {
  console.log("🌱 Seeding database...");

  const passwordHash = bcrypt.hashSync("simisumaq2024", 10);
  await db.insert(users).values({ username: "admin", passwordHash });
  console.log("  ✅ Admin user created (admin / simisumaq2024)");

  const equipoFiles = [
    "abaca-thiago", "acosta-leonardo", "cramaro-carolina", "diaz-soledad",
    "ferreyra-luis", "gallardo-andrea", "mansilla-mariana", "miranda-luz",
    "pereyra-carlina", "roldan-xiomara", "umano-exequiel"
  ];
  for (const file of equipoFiles) {
    const data = readJSON(`src/content/equipo/${file}.json`);
    await db.insert(equipo).values({
      nombre: data.nombre,
      cargo: data.cargo,
      foto: data.foto || null,
      detalle: data.detalle || null,
    });
  }
  console.log(`  ✅ ${equipoFiles.length} equipo members seeded`);

  const eventosFiles = [
    "campana-sonrisas-2024", "capacitacion-regional-2024",
    "encuentro-familias-2024", "taller-acceso-atencion"
  ];
  for (const file of eventosFiles) {
    const data = readJSON(`src/content/eventos/${file}.json`);
    await db.insert(eventos).values({
      titulo: data.titulo,
      fecha: data.fecha,
      descripcion: data.descripcion,
      participantes: data.participantes,
      imagenes: JSON.stringify(data.imagenes || []),
    });
  }
  console.log(`  ✅ ${eventosFiles.length} eventos seeded`);

  const proyectosFiles = [
    "acompanamiento-familiar", "atencion-medica",
    "capacitacion-profesional", "integracion-social"
  ];
  for (const file of proyectosFiles) {
    const data = readJSON(`src/content/proyectos/${file}.json`);
    await db.insert(proyectos).values({
      title: data.title,
      description: data.description,
      resultados: data.resultados,
      icon: data.icon,
      color: data.color,
      orden: data.orden || 99,
    });
  }
  console.log(`  ✅ ${proyectosFiles.length} proyectos seeded`);

  const galeriaFiles = ["foto-1", "foto-2", "foto-3", "foto-4", "foto-5"];
  for (const file of galeriaFiles) {
    const data = readJSON(`src/content/galeria/${file}.json`);
    await db.insert(galeria).values({
      nombre: data.nombre,
      path: data.path,
      categoria: data.categoria || null,
    });
  }
  console.log(`  ✅ ${galeriaFiles.length} galeria items seeded`);

  const tiendaProducts = [
    { name: "Remera Simi Sumaq", description: "Remera de algodon con el logo de la Asociacion.", price: 8000, image: "https://picsum.photos/seed/simisumaq-remera/640/480", active: true },
    { name: "Taza Solidaria", description: "Taza ceramica con frase inspiradora.", price: 6500, image: "https://picsum.photos/seed/simisumaq-taza/640/480", active: true },
    { name: "Gorra Bordada", description: "Gorra ajustable con bordado frontal.", price: 9000, image: "https://picsum.photos/seed/simisumaq-gorra/640/480", active: true },
    { name: "Bolsa Ecologica", description: "Bolsa reutilizable para tus compras solidarias.", price: 4500, image: "https://picsum.photos/seed/simisumaq-bolsa/640/480", active: true },
  ];
  for (const product of tiendaProducts) {
    await db.insert(tienda).values(product);
  }
  console.log(`  ✅ ${tiendaProducts.length} tienda products seeded`);

  const comisionData = [
    { cargo: "Presidenta", nombre: "Lic. Verónica Coria" },
    { cargo: "Secretaria", nombre: "Luz Miranda" },
    { cargo: "Tesorera", nombre: "Soledad Díaz" },
    { cargo: "Vocal 1", nombre: "Soledad Guerra" },
    { cargo: "Vocal 1 Suplente", nombre: "Patricia Galeano" },
    { cargo: "Vocal 2", nombre: "Marta Arias" },
    { cargo: "Vocal 2 Suplente", nombre: "Rita Chávez" },
    { cargo: "Revisora de Cuentas", nombre: "Carlina Pereyra" },
    { cargo: "Revisora de Cuentas Suplente", nombre: "Carolina Crámaro" },
  ];
  for (const miembro of comisionData) {
    await db.insert(comision).values(miembro);
  }
  console.log(`  ✅ ${comisionData.length} comisión directiva seeded`);

  const serviciosData = [
    {
      titulo: "Cirugía Reconstructiva",
      descripcion: "Realizamos cirugías de labio leporino y paladar hendido con técnicas avanzadas para asegurar los mejores resultados estéticos y funcionales.",
      items: JSON.stringify(["Queiloplastia", "Palatoplastia", "Injertos óseos", "Rinoplastia secundaria"]),
      orden: 1,
    },
    {
      titulo: "Fonoaudiología",
      descripcion: "Terapia del lenguaje para mejorar la comunicación, la deglución y la respiración de nuestros pacientes.",
      items: JSON.stringify(["Estimulación temprana", "Reeducación del habla", "Terapia miofuncional", "Evaluación audiológica"]),
      orden: 2,
    },
    {
      titulo: "Apoyo Psicológico y Social",
      descripcion: "Acompañamiento emocional a pacientes y familias para fortalecer su autoestima y facilitar su integración social.",
      items: JSON.stringify(["Psicología clínica", "Talleres para padres", "Asistencia social", "Grupos de apoyo"]),
      orden: 3,
    },
  ];
  for (const servicio of serviciosData) {
    await db.insert(servicios).values(servicio);
  }
  console.log(`  ✅ ${serviciosData.length} servicios seeded`);

  const testimoniosDir = resolve(process.cwd(), "src/content/testimonios");
  if (existsSync(testimoniosDir)) {
    const testFiles = readdirSync(testimoniosDir).filter(f => f.endsWith(".json"));
    for (const file of testFiles) {
      const data = JSON.parse(readFileSync(resolve(testimoniosDir, file), "utf-8"));
      await db.insert(testimonios).values({
        nombre: data.nombre,
        texto: data.texto,
        rol: data.rol,
      });
    }
    console.log(`  ✅ ${testFiles.length} testimonios seeded`);
  }

  await db.insert(configuracion).values({ key: "hero_image", value: "/hero-image.webp" });

  const diagnosticoConfig = {
    titulo: "Diagnóstico",
    texto: "La detección temprana de la fisura labiopalatina es fundamental para garantizar una atención integral oportuna. Un diagnóstico adecuado permite planificar el tratamiento interdisciplinario que cada niño necesita.",
    imagen: "/diagnostico.webp",
  };
  await db.insert(configuracion).values({ key: "diagnostico", value: JSON.stringify(diagnosticoConfig) });

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
  await db.insert(configuracion).values({ key: "colaborar", value: JSON.stringify(colaborarConfig) });

  console.log("  ✅ configuracion seeded");

  console.log("🎉 Database seeded successfully!");
}

seed().catch(console.error);
