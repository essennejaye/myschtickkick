// import the Sequelize constructor from the library
const Sequelize = require('sequelize');
require('dotenv').config();

// create connection to our database, pass in MySQL information from .env for username and password
// connect to local database or heroku database if deployed
let sequelize;
sequelize = process.env.JAWSDB_URL
  ?new Sequelize(process.env.JAWSDB_URL)
  :new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });

  module.exports = sequelize;