# Usa la imagen oficial de Node.js ligera basada en Alpine Linux
FROM node:20-alpine

# Crea y establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto (idealmente en modo producción)
RUN npm install

# Copia todo el código fuente de la aplicación al contenedor
COPY src ./src

# Informa a Docker que el contenedor escuchará en el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación Node.js
CMD [ "node", "src/index.js" ]
