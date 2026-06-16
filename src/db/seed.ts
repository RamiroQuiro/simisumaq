import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users, equipo, eventos, proyectos, galeria, tienda } from "./schema";
import { resolve } from "path";
import { readFileSync, mkdirSync, existsSync } from "fs";
import bcrypt from "bcryptjs";

const DB_PATH = resolve(process.cwd(), "data/simisumaq.db");

const dataDir = resolve(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite);

function readJSON(relativePath: string) {
  const raw = readFileSync(resolve(process.cwd(), relativePath), "utf-8");
  return JSON.parse(raw);
}

console.log("🌱 Seeding database...");

// Create default admin user
const passwordHash = bcrypt.hashSync("simisumaq2024", 10);
db.insert(users).values({ username: "admin", passwordHash }).run();
console.log("  ✅ Admin user created (admin / simisumaq2024)");

// Seed equipo
const equipoFiles = [
  "abaca-thiago", "acosta-leonardo", "cramaro-carolina", "diaz-soledad",
  "ferreyra-luis", "gallardo-andrea", "mansilla-mariana", "miranda-luz",
  "pereyra-carlina", "roldan-xiomara", "umano-exequiel"
];
for (const file of equipoFiles) {
  const data = readJSON(`src/content/equipo/${file}.json`);
  db.insert(equipo).values({
    nombre: data.nombre,
    cargo: data.cargo,
    foto: data.foto || null,
    detalle: data.detalle || null,
  }).run();
}
console.log(`  ✅ ${equipoFiles.length} equipo members seeded`);

// Seed eventos
const eventosFiles = [
  "campana-sonrisas-2024", "capacitacion-regional-2024",
  "encuentro-familias-2024", "taller-acceso-atencion"
];
for (const file of eventosFiles) {
  const data = readJSON(`src/content/eventos/${file}.json`);
  db.insert(eventos).values({
    titulo: data.titulo,
    fecha: data.fecha,
    descripcion: data.descripcion,
    participantes: data.participantes,
    imagenes: JSON.stringify(data.imagenes || []),
  }).run();
}
console.log(`  ✅ ${eventosFiles.length} eventos seeded`);

// Seed proyectos
const proyectosFiles = [
  "acompanamiento-familiar", "atencion-medica",
  "capacitacion-profesional", "integracion-social"
];
for (const file of proyectosFiles) {
  const data = readJSON(`src/content/proyectos/${file}.json`);
  db.insert(proyectos).values({
    title: data.title,
    description: data.description,
    resultados: data.resultados,
    icon: data.icon,
    color: data.color,
    orden: data.orden || 99,
  }).run();
}
console.log(`  ✅ ${proyectosFiles.length} proyectos seeded`);

// Seed galeria
const galeriaFiles = ["foto-1", "foto-2", "foto-3", "foto-4", "foto-5"];
for (const file of galeriaFiles) {
  const data = readJSON(`src/content/galeria/${file}.json`);
  db.insert(galeria).values({
    nombre: data.nombre,
    path: data.path,
    categoria: data.categoria || null,
  }).run();
}
console.log(`  ✅ ${galeriaFiles.length} galeria items seeded`);

// Seed tienda (products from TiendaClient.tsx)
const tiendaProducts = [
  { name: "Remera Simi Sumaq", description: "Remera de algodon con el logo de la Asociacion.", price: 8000, image: "https://picsum.photos/seed/simisumaq-remera/640/480" },
  { name: "Taza Solidaria", description: "Taza ceramica con frase inspiradora.", price: 6500, image: "https://picsum.photos/seed/simisumaq-taza/640/480" },
  { name: "Gorra Bordada", description: "Gorra ajustable con bordado frontal.", price: 9000, image: "https://picsum.photos/seed/simisumaq-gorra/640/480" },
  { name: "Bolsa Ecologica", description: "Bolsa reutilizable para tus compras solidarias.", price: 4500, image: "https://picsum.photos/seed/simisumaq-bolsa/640/480" },
];
for (const product of tiendaProducts) {
  db.insert(tienda).values(product).run();
}
console.log(`  ✅ ${tiendaProducts.length} tienda products seeded`);

sqlite.close();
console.log("🎉 Database seeded successfully!");
