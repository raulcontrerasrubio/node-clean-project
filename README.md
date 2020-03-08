# Node Clean Project

A initial NodeJS project already configured

## Getting started

> Only npm is allowed to install the dependencies

1. Create a `.env` file with the keys of the `.env.defaults` file:
2. Run `npm run start-dev` to init the project with nodemon
3. Run `npm start` to init the project without nodemon

## Scripts

- Run on development mode: `npm run start-dev`
- Run on production mode: `npm start`
- Run unit tests: `npm run test-unit`
- Run integration tests: `npm run test-integration`

> Unit test and integration test scripts change the NODE_ENV variable

## Database

IMPORTANT

We are using Sequelize to manage all the database flow. To create the tables we are using `sequelize.sync()`, which is not recommended for production enviroments. Be sure to manage it!
