FROM node:22-alpine
LABEL authors="Mihajlo"

ENV NODE_ENV=production
ENV PORT=5000
ENV MONGO_URI=TEST

WORKDIR /app

COPY package*.json /app

RUN npm install --omit=dev

COPY . .

ENTRYPOINT ["npm", "start"]
