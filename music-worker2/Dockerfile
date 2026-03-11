# ETAPA 1: Construcción (Builder)
FROM node:22-alpine AS builder
WORKDIR /app

# Instalamos dependencias necesarias para compilaciones nativas (si las hay)
RUN apk add --no-cache python3 make g++

# Copiamos archivos de dependencias
COPY package.json package-lock.json* ./
# Usamos 'npm ci' para una instalación limpia y exacta basada en el lockfile
RUN npm ci

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto (esto asume que tienes un script "build": "tsc")
RUN npm run build

# ---
# ETAPA 2: Ejecución (Runner)
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

# Solo traemos los archivos compilados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Instalamos SOLO dependencias de producción para mantener la imagen pequeña
# Esto evita llevarse librerías de desarrollo como TypeScript o linters
RUN npm ci --omit=dev

# Usamos el usuario "node" incluido en la imagen por seguridad (opcional pero recomendado)
USER node

# Ejecutamos con Node
CMD ["node", "dist/index.js"]