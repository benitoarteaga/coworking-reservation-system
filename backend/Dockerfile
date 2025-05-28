# Usamos la imagen oficial de node como base
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todo el código del backend
COPY . .

# Exponemos el puerto 4000
EXPOSE 4000

# Comando para correr la app
CMD ["node", "app.js"]
