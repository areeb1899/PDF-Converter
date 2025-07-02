FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y libreoffice poppler-utils ghostscript

RUN npm install

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
