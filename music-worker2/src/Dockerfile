# ETAPA 1: Construcción (Builder)
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

# Copiamos archivos de dependencias primero para cachear capas
COPY package.json bun.lock* ./
RUN bun install

# Copiamos el resto del código
COPY . .

# Generamos el bundle de JS (Esto valida que el TS sea correcto)
# Asegúrate de que este script esté en tu package.json
RUN bun run build 

# ETAPA 2: Ejecución (Runner) - Imagen final mucho más pequeña
FROM oven/bun:1.3-alpine
WORKDIR /app

# Solo traemos lo estrictamente necesario de la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
# Copiamos node_modules porque Bun/Lavalink a veces requieren librerías nativas
COPY --from=builder /app/node_modules ./node_modules 

ENV NODE_ENV=production

# Ejecutamos el archivo generado en /dist
CMD ["bun", "dist/index.js"]