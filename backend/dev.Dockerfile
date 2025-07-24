FROM node:22-alpine
LABEL authors="Mihajlo"

ENV NODE_ENV=development
ENV PORT=5000

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

ENTRYPOINT ["npm", "run", "start:dev"]
