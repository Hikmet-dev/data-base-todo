require('dotenv').config({ path: __dirname + '/.env' });
console.log(require('dotenv').config());
module.exports = {
  "development": {
    "username": "postgres",
    "password": "437668820Asd",
    "database": "db_todo",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "437668820Asd",
    "database": "db_todo",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "437668820Asd",
    "database": "db_todo",
    "host": "localhost",
    "dialect": "postgres"
  }
}
