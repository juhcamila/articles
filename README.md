<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

<h2>Para o desenvolvimento dessa API de tutorials foi necessário avaliar e pensar no design de arquitetura para esse tipo de API.</h2>

- Linguagem de programação
- Framework
- Banco de dados
- ORM
- Cache
- Será necessário utilizar docker?
- Documentação de API
- Compreensão de Problemas
- Regras de negócios

## Tecnologias e ferramentas

- Nodejs v22.6
- Nestjs
- Mysql v8.0
- Sequelize
- cache-manager
- Swagger
- class-validator

## Separação de arquivos

- entity - Model do banco de dados
- controllers - Responsável pelas rotas
- services - Regra de negócio
- Repository - CRUD banco de dados

## Installation

```bash
$ nvm use 22.6.0
$ npm install
```

## Running the app

```bash
# Base de dados com docker
$ docker compose up -d
$ npx sequelize-cli db:create

# Caso ocorra o erro "ERROR: Access denied for user 'process'@'172.25.0.1' (using password: YES)"
$ docker exec -it my_mysql bash
$ mysql -u root -p
$ CREATE USER 'process'@'%' IDENTIFIED WITH mysql_native_password BY 'process';
$ GRANT ALL PRIVILEGES ON *.* TO 'process'@'%';
$ FLUSH PRIVILEGES;
$ exit
$ exit

# development
$ npm run start:dev

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Swagger

Acessar rota  http://localhost:3000/api