# 1. Imagen oficial de Node.js (versión LTS, variante ligera "alpine")
FROM node:22-alpine
 
# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app
 
# 3. Copiar PRIMERO solo los archivos de dependencias
COPY package.json package-lock.json ./
 
# 4. Instalar dependencias
RUN npm install
 
# 5. Copiar el resto del código y compilar TypeScript -> JavaScript (dist/)
COPY . .
RUN npm run build
 
# 6. Documentar el puerto que usa la aplicación
EXPOSE 3000
 
# 7. Comando que arranca el servidor
CMD ["node", "dist/server.js"]
