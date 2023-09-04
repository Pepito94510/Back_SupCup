## Recuperation de l'image docker Node (officiel), version latest
FROM node:latest

## Creation du répertoire
WORKDIR Back_SupCup/

## Copie des sources dans le répertoire
COPY . .

## Installation des packages npm
RUN npm install --production

## Ouverture du port 5001
EXPOSE 5001

## Lancement du script
CMD npm run start

