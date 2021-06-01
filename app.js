
const express = require('express');
const taskGET =  require('./api/tasks.get.js');
const  taskDELETE = require('./api/task.delete.js');
const  taskPATCH =  require('./api/task.patch.js');
const taskPOST =  require('./api/task.post.js');
const morgan = require('morgan');
const { handleError } = require('./errors.js');
const { ErrorHandler } = require('./errors.js');


const { sequelize, Task } = require('./models');




const app = express();


const PORT = process.env.PORT || 3000;
app.use(express.json());



app.post('/tasker', async(req, res, next) => {
  const { name, done, doneR } = req.body;

  try {
    if(!name || !done) {
      throw new ErrorHandler(404, 'Not found')
    }
    const task = await Task.create({ name, done, doneR });
    return res.json(task);
  } catch (err) {
    console.log(err);
    next(err)
  }
})





app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.send('<h1>Todo-back-end</h1>')
})
app.use(taskGET);
app.use(taskPOST);
app.use(taskPATCH);
app.use(taskDELETE);
app.use((err, req, res, next) => {
    handleError(err, res);
  })



app.listen({port: PORT}, async () => {
  console.log('Server uo on');
  await sequelize.sync({force: true});
  console.log('Datebase synced!');
});