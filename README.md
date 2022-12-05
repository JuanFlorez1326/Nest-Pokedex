<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Install Packages

```bash
$ yarn install
```

## Lift Database With Docker
```
$ docker-compose up -d
```

## Rebuild Database With Seed
```bash
# development
http://localhost:3000/api/v2/seed
```

## Docker
```bash
# Build
$ docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

# Run
$ docker-compose -f docker-compose.prod.yaml --env-file .env.prod up

# Note
Por defecto, docker-compose usa el archivo .env, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, usar:

$ docker-compose -f docker-compose.prod.yaml up --build
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Stack
```
  * MongoDB
  * NestJs
  * Docker
```