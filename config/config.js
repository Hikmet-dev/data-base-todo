require('dotenv').config({ path: __dirname + '/.env' });
 module.exports = {
  development: {
    "username": "postgres",
    "password": "437668820Asd",
    "database": "db_todo",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  },
  test: {
    "username": "postgres",
    "password": "437668820Asd",
    "database": "db_todo",
    "host": "localhost",
    "dialect": "postgres"
  },
  production: {
    username: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASS,
    database: process.env.DB_PROD_DBNAME,
    host: process.env.DB_PROD_HOST,
    port: process.env.DB_PROD_PORT,
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
