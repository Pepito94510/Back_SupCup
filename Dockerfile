FROM node:latest

WORKDIR Back_SupCup/

COPY . .

RUN npm install --production

EXPOSE 5001

CMD npm run start

