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