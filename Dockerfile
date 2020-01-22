FROM node:latest
WORKDIR /usr/src/app
COPY ./app .
RUN npm install
CMD [ "npm", "start" ]