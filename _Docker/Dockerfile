FROM node:16-slim

WORKDIR /app

RUN npm install -g typescript
RUN npm install -g nodemon
#RUN npm install typescript-rest-swagger -g

COPY _Docker/entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh