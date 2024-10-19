FROM node:20.11.0

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install -g ts-node typescript @nestjs/cli

COPY . .

COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

EXPOSE 3000

CMD ["sh", "-c", "printenv && echo 'Environment variables printed above.' && npm install && wait-for-it mysql:3306 --timeout=60 --strict -- npm run migration:run && npm run build && npm run start"]
