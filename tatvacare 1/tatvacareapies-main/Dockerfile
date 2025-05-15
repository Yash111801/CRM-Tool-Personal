# backend/Dockerfile
FROM node:18
COPY package*.json ./
RUN npm install --production
RUN npm install -g nodemon
#COPY env .env
ARG APP_ENV
COPY .env.${APP_ENV} .env
COPY . .
CMD ["node", "index.js"]
