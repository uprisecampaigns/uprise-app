FROM node:boron

RUN npm install nodemon -g
RUN npm install gulp -g

WORKDIR /src/app
ADD package.json package.json
RUN npm install

CMD ["npm", "start"]
