const express = require('express');
const taskGET =  require('./api/tasks.get.js');
const taskDELETE = require('./api/task.delete.js');
const taskPATCH =  require('./api/task.patch.js');
const taskPOST =  require('./api/task.post.js');
const morgan = require('morgan');
const { handleError } = require('./errors.js');
const { sequelize } = require('./models');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.send('<h1>Data Base todo</h1>')
})
app.get('/favicon.ico', (req, res) => {
  res.sendFile('./favicon.ico')
});
app.use(taskGET);
app.use(taskPOST);
app.use(taskPATCH);
app.use(taskDELETE);
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
    handleError(err, res);
  })

app.listen({port: PORT}, async () => {
  console.log('Server uo on');
  await sequelize.authenticate();
  console.log('Datebase synced!');
});