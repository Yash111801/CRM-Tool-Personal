FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
# RUN npm install --save-dev webpack@4.41.0
COPY . .
COPY env .env
RUN npm run build
COPY public/sample* dist/
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
