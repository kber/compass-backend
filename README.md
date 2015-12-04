Compass service
=================

This is a sample service using NodeJS, Koa

Node.js 4.2.1
mysql 5.6.26+

Usage
-------

### Prepare database env

```bash
brew install mysql
mysql -uroot 
"create database bolt_compass;"

npm run db
```

### Start the server

```bash
npm start
```

### Start the development env server

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
database |  MySQL
server   |  koa
ORM      |  bookshelf
