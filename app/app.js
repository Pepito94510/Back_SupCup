import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

//Add router here
import userRouter from './routes/userRoute.js';
import sportRouter from './routes/sportRoute.js';
import equipeRouter from './routes/equipeRoute.js';
import eventRouter from './routes/eventRoute.js';
import roleRouter from './routes/roleRoute.js';
import barRouter from './routes/barRoute.js';


export default function (database) {
  const app = express()
  app.use(express.json())
  app.use(cors())
  app.use(bodyParser())

  //add routes here
  app.use('/user', userRouter);
  app.use('/sport', sportRouter);
  app.use('/equipe', equipeRouter);
  app.use('/event', eventRouter);
  app.use('/role', roleRouter);
  app.use('/bar', barRouter);

  // Global routes
  app.get('/', (req, res) => {
    res.status(200).send('Hello world !');
  });

  app.get('/test', (req, res) => {
    res.status(200).send('Test !');
  });

  return app
}
