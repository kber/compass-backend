Compass service
=================

This is backend service for Compass project using NodeJS, Koa

Node.js 4.2.1
postgreSQL 9.4.5

Usage
-------

### Prepare database environment

```bash
brew install postgresql
alias postgres.server='pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start'
alias postgres.stop='pg_ctl -D /usr/local/var/postgres stop -s -m fast'
postgres.server

psql -d template1 -U postgres
create user compass with password 'start123';
create database compass_backend;
grant all privileges on database compass_backend to compass;
\q
```
### Initialize database schema

```bash
npm run db
```

### Start the server

```bash
npm start
```

### Start the development environment server

```bash
npm run dev
```

Database Migration
------------------

We are using [knex.js](http://knexjs.org) to help us generate and manage the database Migration. So please use knex.js migration to migrate all the database changes.

```bash
npm i -g knex
```

### Create a new migration

```bash
knex migrate:make migration_name
```

### Migrate to the latest migrations

```bash
knex migrate:latest
```

For more information please check the documentation: http://knexjs.org/#Migrations .

### Insert seed data

```bash
knex seed:run
```

Database Fixtures
------------------

We are using [node-sql-fixtures](http://www.mattgreer.org/articles/node-sql-fixtures/) to help us generate and manage database fixtures.

### Insert fixtures into database

```bash
node ./fixtures/create.js
```

Technical Stack
-----------------

### Server

type     |  name
-------- | ------
database |  PostgreSQL
server   |  koa
ORM      |  bookshelf
