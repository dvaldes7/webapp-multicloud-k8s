# ===============================================================================        
# STAGE 1: BUILD STAGE - Compilar la aplicación React con TypeScript
# ===============================================================================        
# Usamos node:18-alpine como imagen base porque:
# - Node 18 es LTS (soporte a largo plazo)
# - Alpine es una distribución Linux ultra ligera (~5MB vs ~900MB de ubuntu)
# - Incluye npm y todas las herramientas necesarias para construir React
# Esta etapa es solo temporal, se descarta es para construir el proyecto
FROM node:18-alpine as builder 

# Establecer directorio de trabajo dentro del contenedor
# Todo lo que hagamos a partir de aquí será relativo a /app
# Si no existe, Docker lo crea automáticamente
WORKDIR /app

# Copiar SOLO los archivos de dependencias primero (package.json y package-lock.json)
# ¿Por qué solo estos archivos y no todo el código?
# - Docker usa capas (layers) y las cachea
#- Si cambias solo código → package.json no cambió → Docker reutiliza la capa de npm install
#- Si cambias dependencias → package.json cambió → Docker reinstala todo
# El ./ significa "al directorio actual" (/app)
COPY package*.json ./

# Instalar las dependencias de Node.js
# Este paso puede tomar varios minutos en la primera ejecución
# Pero si no cambiamos package.json, Docker reutiliza esta capa cacheada
# --only=production NO aplica aquí porque necesitamos devDependencies para el build
RUN npm ci

# Ahora SÍ copiamos todo el código fuente
# Lo hacemos después de npm install para aprovechar el cache de Docker
# El . significa "todo en el directorio actual del host"
# El . final significa "al directorio actual del contenedor" (/app)
#Primera vez (build inicial):
# - Construye todas las capas (5 minutos)

# Cambias código en App.tsx:
# - Capa 1: ✅ Reutiliza (cache)
# - Capa 2: ✅ Reutiliza (package.json no cambió)
# - Capa 3: ✅ Reutiliza (npm ci no se ejecuta otra vez!)
# - Capa 4: ❌ Reconstruye (código cambió)
COPY . .

# Construir la aplicación para producción
# Este comando:
# 1. Ejecuta TypeScript compiler (tsc -b)
# 2. Ejecuta Vite build
# 3. Genera archivos optimizados en la carpeta /app/dist
# 4. Minifica CSS, JS, optimiza imágenes, etc.
RUN npm run build

# ===============================================================================
# STAGE 2: PRODUCTION STAGE - Servir la aplicación con Nginx
# ===============================================================================
# Nueva imagen base para producción: nginx con Alpine Linux
# ¿Por qué nginx?
# - Servidor web extremadamente eficiente para archivos estáticos
# - Configuración mínima requerida
# - Muy ligero y rápido
# ¿Por qué no usar la imagen de Node.js?
# - No necesitamos Node.js en producción, solo servir archivos HTML/CSS/JS
# - Nginx es mucho más eficiente para esto
FROM nginx:alpine

# Copiar los archivos construidos desde el stage anterior
# --from=builder: toma archivos del contenedor "builder" (stage 1)
# /app/dist: donde Vite generó los archivos de producción
# /usr/share/nginx/html: directorio por defecto donde nginx busca archivos para servir
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80 (puerto por defecto de HTTP)
# Esto es solo documentación - le dice a otros desarrolladores qué puerto usar
# Para acceder desde el host necesitarás hacer port mapping: -p 3000:80
EXPOSE 80

# Comando que se ejecuta cuando inicia el contenedor
# nginx: ejecutar el servidor nginx
# -g "daemon off;": mantener nginx en primer plano (no como daemon)
# Esto es necesario porque Docker necesita un proceso principal activo
CMD ["nginx", "-g", "daemon off;"]


#🗂️ Proceso paso a paso:

#  1. Docker crea contenedor temporal con Node.js
#  2. Construye tu app dentro de ese contenedor
#  3. Docker crea nuevo contenedor con Nginx
#  4. Copia solo los archivos del contenedor temporal al nuevo
#  5. Bota el contenedor temporal (y toda la imagen de Node.js)

#1. Build local: docker build -t mi-webapp .
#2. Run local: docker run -p 3000:80 mi-webapp
#3. Probar en http://localhost:3000