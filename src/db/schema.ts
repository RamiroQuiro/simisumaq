import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const equipo = sqliteTable("equipo", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  cargo: text("cargo").notNull(),
  foto: text("foto"),
  detalle: text("detalle"),
});

export const eventos = sqliteTable("eventos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  fecha: text("fecha").notNull(),
  fechaISO: text("fechaISO"),
  descripcion: text("descripcion").notNull(),
  participantes: text("participantes").notNull(),
  imagenes: text("imagenes").notNull().default("[]"),
  cover: text("cover"),
});

export const proyectos = sqliteTable("proyectos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  resultados: text("resultados").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  orden: integer("orden").default(99),
  cover: text("cover"),
});

export const galeria = sqliteTable("galeria", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  path: text("path").notNull(),
  categoria: text("categoria"),
});

export const tienda = sqliteTable("tienda", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const testimonios = sqliteTable("testimonios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  texto: text("texto").notNull(),
  rol: text("rol").notNull(),
});

export const comision = sqliteTable("comision", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cargo: text("cargo").notNull(),
  nombre: text("nombre").notNull(),
});

export const servicios = sqliteTable("servicios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  items: text("items").notNull().default("[]"),
  orden: integer("orden").default(99),
  cover: text("cover"),
});
