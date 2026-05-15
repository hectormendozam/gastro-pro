FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src ./src

EXPOSE 3002

CMD [ "node", "src/index.js" ]
