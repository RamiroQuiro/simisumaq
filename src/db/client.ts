import * as schema from "./schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const dataDir = resolve(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const client = createClient({ url: "file:data/simisumaq.db" });
const db = drizzle(client, { schema });

export { db };
