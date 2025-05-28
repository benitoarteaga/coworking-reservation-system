# Usa Node 18 (o la versión que prefieras)
FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia archivos de dependencias primero para aprovechar cache
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usa Vite por defecto
EXPOSE 5173

# Ejecuta el servidor de desarrollo de Vite escuchando en todas las interfaces
CMD ["npm", "run", "dev"]
