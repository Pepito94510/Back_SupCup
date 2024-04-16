import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'

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
  app.use('/api/user', userRouter);
  app.use('/api/sport', sportRouter);
  app.use('/api/equipe', equipeRouter);
  app.use('/api/event', eventRouter);
  app.use('/api/role', roleRouter);
  app.use('/api/bar', barRouter);

  // Swagger documentation

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Node JS API project for supcup backend',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:5001/'
        }
      ]
    },
    apis: ['./routes/*.js']
  }

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


  // Global routes
  app.get('/api/', (req, res) => {
    res.status(200).send('Hello world !');
  });

  app.get('/api/test', (req, res) => {
    res.status(200).send('Test !');
  });

  return app
}
