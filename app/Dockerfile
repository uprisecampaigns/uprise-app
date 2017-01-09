FROM node:boron

RUN mkdir /src

RUN npm install nodemon -g
RUN npm install gulp -g

WORKDIR /src
ADD package.json package.json
RUN npm install

CMD ["npm", "start"]
