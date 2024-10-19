FROM node:20.11.0

WORKDIR /usr/src/genre

COPY package*.json ./

RUN npm install -g ts-node typescript

COPY . .

CMD ["sh", "-c", "printenv && echo 'Environment variables printed above.' && npm install && ts-node themes.ts"]
