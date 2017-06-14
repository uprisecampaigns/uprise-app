# Uprise Campaigns Volunteer Platform App

One stop containerized repo for all of the pieces of the Uprise Campaigns Volunteer Platform App.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

We're using docker to containerize the various components that make up our platform. To that end, you'll need docker engine and docker-compose. Any installation instructions assume Ubuntu 16.04

Instructions for installing docker engine come from https://docs.docker.com/engine/installation/
Ubuntu instructions are https://docs.docker.com/engine/installation/linux/ubuntu/

Installation instructions for docker-compose are at https://docs.docker.com/compose/install/


### Installing

There are 6 containers delineated in the docker-compose file:

 - nginx: 
   This container runs nginx which is configured to run as a web server and a reverse proxy. The environment variables for this container are inside `nginx/dev.env` and `nginx/prod.env` respectively. 

 - letsencrypt: 
   The only role this container plays is in fetching letsencrypt ssl certificates and placing them in a volume shared with the nginx container. To specify a different domain or a different contact email address, change the command line (this should eventually be refactored into a separate environment variable to avoid having to edit the docker-compose file)

 - redis: 
   This is solely used as an cache for nodejs authentication management. It uses the default container image and no specific configuration

 - db: 
   A postgres database. The `db/Dockerfile` pulls the default postgresql image and then creates an application database and sets up postgis with zipcodes. 

 - db-backup:
   A cron job that runs a pg_dump and then uploads the output of that to an s3 bucket nightly.

 - web:
   This does most of the heavy lifting of the app. It contains 2 parts: the nodejs server side and the webpack compilation/build setup which create the front-end html/javascript/css which the browser will download and run. More details on the web setup are in a below section.


Configuring and installing the platform should consist of two steps: 

1. Properly set environment variables
2. Run `docker-compose build`
3. Run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

This should start up all appropriate containers. With default environment variables, visiting `localhost:8080` should direct you to the application.


## App Design Decisions

The `./app` folder contains the bulk of the app which is divided into a nodejs server side and the webpack compilation/build setup which create the front-end html/javascript/css which the browser will download and run.

For simplicity, the two separate parts are within the same container. They share a `package.json` and therefore a `node_modules` folder. Because webpack only bundles necessary packages, this doesn't cause front-end code bloat. It allows for the convenient sharing of environment variables and co-required modules. The drawbacks (and good reasons to eventually change from this approach) are:

 - The client and server may eventually require different versions of the same module
 - It breaks the container model of only running one service per container. 
The `package.json` commands use an ampersand to concurrently run the server in and the front-end build steps. 
Because in production this currently only happens on startup, it's not a significant concern, but when deployment becomes more complex, this could cause issues.

### Server

The server is an [Express.js](https://expressjs.com/) app which handles authentication and database/model management, and which provides a [GraphQL](https://graphql.org/) API to the client.


#### Migrations

The server is currently using [Knex.js](http://knexjs.org/) for both SQL query building and migrations.
In the future, I would like to migrate away from Knex.js for migrations to a better, more specific tool.

In order to run migrations, you can use an npm script inside the `app` container:

Run all migrations:
```
npm run db:migrate:latest
```

Rollback the most recent migration:
```
npm run db:migrate:rollback
```

Add the seed file data (demo data) to the running database
```
npm run db:seed:run
```


### Client

The client is a [Webpack](https://webpack.github.io) bundled set of js/html/css/img files which are delivered to the browser.

[ReactJS](https://facebook.github.io/react/) provides a view-layer framework. 
In combination with nginx settings and the [html5 history api](https://developer.mozilla.org/en-US/docs/Web/API/History) which is implemented with the [history](https://www.npmjs.com/package/history) library, all front-facing routing is handled by the client.

[Material-UI](http://www.material-ui.com/) provides a set of react components which implement Google's Material Design. This allows us to more easily add things like styled modals, dropdowns, menus, etc).

The styling is currently done in a kind of poor combination of [Sass](http://sass-lang.com), [CSS Modules](https://github.com/css-modules/css-modules) and css-in-javascript. 
Part of the problem is that Material-UI currently uses a css-in-javascript approach that I disagree with. 
Their [v1.0](https://github.com/callemall/material-ui/blob/master/ROADMAP.md) will be a significant migration and will rely on [JSS](https://github.com/cssinjs/jss) instead.
A significant portion of the styling will have to be reviewed at that point and it may be a good time to rethink the current styling approach. 


## Running the tests

There are currently a limited number of tests which can be run by entering the `./app` directory and running `npm run test`.

## Deployment

There are only a couple things different about deploying a production instance. 
The staging site is currently on a single Ubuntu 16.04 droplet with docker and docker-compose installed on it. 
As reliability/production-readiness becomes more important, that choice of hosting/infrastructure may change. 
Several companies (including digital ocean) offer docker-ready VMs or more specific docker infrastructure. 
Kubernetes would be an interesting direction, though likely only in the longer term as it has a much higher learning curve/operational-deployment overhead.

Important notes for deployment/production:
 - There are separate additional docker-compose files for dev and prod environments. The `docker-compose.yml` file contains base configurations, while the additional files extend that configuration. To run in production you would use: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up`
 - Because of the way that docker networking works, iptables and ufw in particular are slightly less intuitive than they might otherwise be. 
Technically, connections from the outside world to the docker containers are governed by `FORWARD` rules, NOT `INPUT` ones. 
You could therefore potentially block all `INPUT` traffic except to a limited set of ports (22, 80, 443, etc) and still end up allowing unlimited access to ports within the containers. 
This could be VERY dangerous if you, for example, misconfigure your database to listen to all interfaces, instead of just to `localhost`, which could allow access from the outside.
You could similarly accidentally leave other vulnerable ports open.

## Backup+Restore

The `db-backup` service will automatically backup a dump of the app database every night at 3:30am (completely arbitrary). The AWS settings are all stored in `postgres-backup/backup.env` and will need to be set with the appropriate AWS S3 parameters.

Restoring is slightly more tricky and there currently is no automated procedure because of the nature of what exactly is wrong and what needs to be fixed.

An example restore code might be:
```
docker-compose exec db-backup /bin/bash

aws s3 cp s3://$AWS_S3_BUCKET_NAME/$AWS_S3_PREFIX/THE_BACKUP_FILENAME_YOU_WANT_TO_RESTORE_FROM.gzip /tmp/

gunzip /tmp/THE_BACKUP_FILENAME_YOU_WANT_TO_RESTORE_FROM.gzip

pg_restore -d $DATABASE_NAME -U postgres -p $DATABASE_PORT -h $DATABASE_HOST --clean --if-exists --schema=app /tmp/THE_BACKUP_FILENAME_YOU_WANT_TO_RESTORE_FROM
```

This will drop existing data and may not be necessary/appropriate. Check `pg_restore --help` for more options.

## Built With

* [Docker](https://www.docker.com/) - Containerization
* [Docker Compose](https://docs.docker.com/compose/) - Container orchestration(ish)
* [PostgreSQL](https://www.postgresql.org/) - Relational database
* [NGINX](https://www.nginx.com/) - Web server and reverse proxy
* [Express.js](https://expressjs.com/) - Nodejs web server
* [GraphQL](https://graphql.org/) - API query language
* [ReactJS](https://facebook.github.io/react/) - Front end view layer framework
* [Material-UI](http://www.material-ui.com/) - Library of react components that implement Material Design
* [Apollo](http://dev.apollodata.com/) - GraphQL framework/libraries
* [Webpack](https://webpack.github.io) - Javascript front end module bundler
* [Babel](http://babeljs.io/) - Javascript compiler to allow next generation javascript features
* [Redis](https://redis.io) - User authentication caching

## Authors

* **Max Bittman** - [maxb](https://github.com/max-b)

