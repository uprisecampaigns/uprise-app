FROM node:8

WORKDIR /src/app
ADD package.json package.json
RUN useradd --home-dir /src/app app
RUN chown -R app:app /src/app
USER app
RUN npm install

USER root
CMD ["npm", "start"]
