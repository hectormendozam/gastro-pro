FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src ./src

EXPOSE 3001

CMD [ "node", "src/index.js" ]
