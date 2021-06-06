const express = require('express');
const morgan = require('morgan');
const { handleError } = require('./errors.js');
const { sequelize } = require('./models');
const recursive = require('recursive-readdir-sync');

const app = express();

const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use(morgan('combined'));

recursive(`${__dirname}/routes`)
    .forEach(file => app.use('/', require(file)));
app.get('/', (req, res) => {
  return res.send("hello")
})
app.use((err, req, res, next) => {
    handleError(err, res);
  });


app.listen({port: PORT}, async () => {
  console.log(`Server on ${PORT}-port` );
  await sequelize.authenticate();
  console.log('Datebase synced!');
});

