FROM node:12.13.0-alpine as builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install react-scripts@3.0.1 
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]