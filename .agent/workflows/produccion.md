---
description: Cómo preparar y desplegar la aplicación a producción
---

Para poner esta aplicación en producción, debes seguir estos pasos fundamentales:

### 1. Construir el Proyecto (Build)

Este comando compila tu código y genera una carpeta `dist` con los archivos estáticos listos para producción.

```bash
# Si usas pnpm:
pnpm run build

# O si prefieres npm:
npm run build
```

### 2. Verificar Localmente (Preview)

Antes de subirlo al servidor real, es bueno verificar que la versión de producción funcione correctamente.

```bash
pnpm run preview
# o
npm run preview
```

### 3. Despliegue en VPS con PM2

Si estás en un VPS y quieres usar PM2 para mantener el sitio online:

1. **Construir**: `pnpm run build`
2. **Iniciar con PM2**:
   ```bash
   pm2 start ecosystem.config.js
   ```

El servidor usará `npx serve` para entregar los archivos de `dist/` en el puerto 4324 (el que tienes configurado en tu `astro.config.mjs`).

> [!TIP]
> No necesitas instalar `serve` globalmente ni como dependencia fija, el comando `npx` lo descargará y ejecutará automáticamente si no está presente.

> [!NOTE]
> En Astro, no existe el comando `pnpm run start` por defecto porque el resultado suele ser código estático que no necesita un servidor Node.js para ejecutarse, sino solo un servidor de archivos.
