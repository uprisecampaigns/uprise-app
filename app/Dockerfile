FROM node:8

WORKDIR /src/app
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY scripts scripts
RUN useradd --home-dir /src/app app
RUN chown -R app:app /src/app
USER app
RUN npm install

USER root
CMD ["npm", "start"]
