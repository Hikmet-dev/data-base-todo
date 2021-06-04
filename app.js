const express = require('express');
const morgan = require('morgan');
const { handleError } = require('./errors.js');
const { sequelize } = require('./models');
const recursive = require('recursive-readdir-sync');



const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(morgan('combined'));

recursive(`${__dirname}/routes`)
    .forEach(file => app.use('/', require(file)));

app.use((err, req, res, next) => {
    handleError(err, res);
  });



app.listen({port: PORT}, async () => {
  console.log('Server uo on');
  await sequelize.authenticate();
  console.log('Datebase synced!');
});

