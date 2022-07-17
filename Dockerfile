FROM node:16

WORKDIR /app

COPY . .
RUN npm install

ENV MONGODB_USER="root"
ENV MONGODB_PASSWORD="root"
ENV MONGODB_URL="host.docker.internal"
ENV MONGODB_PORT="27017"

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
