FROM node:alpine
WORKDIR /app
EXPOSE 80

COPY ./dist .

CMD node index.js start -h 0.0.0.0 -p 80 -r https://rm.itexpert.ru