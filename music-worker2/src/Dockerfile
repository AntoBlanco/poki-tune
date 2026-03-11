# ETAPA 1: Construcción
FROM node:22-alpine AS builder
WORKDIR /app

# Instalamos dependencias de compilación
RUN apk add --no-cache python3 make g++

# Copiamos archivos de dependencias
COPY package*.json ./

# ✅ CRUCIAL: Instalamos TODO (incluyendo typescript) para poder compilar
# Usamos install en lugar de ci si no tienes un package-lock.json actualizado
RUN npm install

COPY . .

# ✅ Usamos npx para asegurar que use el binario local de node_modules
RUN npx tsc

---

# ETAPA 2: Ejecución
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copiamos solo lo necesario
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# ✅ Instalamos solo dependencias de producción (aquí sí omitimos dev)
RUN npm install --omit=dev

# Si usas librerías nativas que requieran python/make, deberías instalarlas aquí también
# pero normalmente para Shoukaku/Discord.js no hace falta en la etapa final.

USER node

CMD ["node", "dist/index.js"]