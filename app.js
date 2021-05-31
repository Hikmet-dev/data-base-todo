
import express from 'express';
import taskGET  from './api/tasks.get.js';
import  taskDELETE  from './api/task.delete.js';
import  taskPATCH  from './api/task.patch.js';
import taskPOST  from './api/task.post.js';
import morgan  from 'morgan';
import { handleError } from './errors.js';
import { Sequelize} from 'sequelize';
import pkg from 'sequelize';

const { DataTypes } = pkg;

const sequelize = new Sequelize('db_todo', 'postgres', 'memasik4321', {
  host: 'localhost',
  port: 5433,
  dialect: 'postgres',
  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000
  }
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) { 
  console.error('Unable to connect to the database:', error);
};


const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  done: {
    type: DataTypes.BOOLEAN
  },
  create_dt: {
    type: DataTypes.DATE
  }
})

const app = express();


const PORT = process.env.PORT || 3000;
app.use(express.json())




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
    next();
  })



app.listen(PORT);