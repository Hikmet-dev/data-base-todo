require('dotenv').config({ path: __dirname + '/.env' });
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
    "use_env_variable": "postgres://dzhxdjumiixqtx:1a644464f35a9960fa2e88c71ab9a95a7aba264864181b8192d826db6b013d7b@ec2-54-155-226-153.eu-west-1.compute.amazonaws.com:5432/dcv2c1845oh2vs",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": true,
    }   
  }
}
