import { defineCollection, z } from "astro:content";

const equipoCollection = defineCollection({
  type: "data",
  schema: z.object({
    nombre: z.string(),
    cargo: z.string(),
    detalle: z.string().optional(),
  }),
});

const eventosCollection = defineCollection({
  type: "data",
  schema: z.object({
    titulo: z.string(),
    fecha: z.string(),
    descripcion: z.string(),
    participantes: z.string(),
    imagenes: z.array(z.string()),
  }),
});

const proyectosCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    resultados: z.string(),
    icon: z.string(), // nombre del icono de lucide
    color: z.string(),
    orden: z.number().optional(),
  }),
});

const testimoniosCollection = defineCollection({
  type: "data",
  schema: z.object({
    nombre: z.string(),
    texto: z.string(),
    rol: z.string(),
  }),
});

const galeriaCollection = defineCollection({
  type: "data",
  schema: z.object({
    nombre: z.string(),
    path: z.string(),
    categoria: z.string().optional(),
  }),
});

export const collections = {
  equipo: equipoCollection,
  eventos: eventosCollection,
  proyectos: proyectosCollection,
  testimonios: testimoniosCollection,
  galeria: galeriaCollection,
};
