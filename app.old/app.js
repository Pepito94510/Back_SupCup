const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
require('dotenv').config()

// Add route require here
const routesUser = require('./routes/user');
const routeSport = require('./routes/sport');
const routeEquipe = require('./routes/equipe');
const routeEvent = require('./routes/event');
const routeBar = require('./routes/bar');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser());
app.use(express.static('public'));


// use differents routes here
app.use('/user', routesUser);
app.use('/sport', routeSport);
app.use('/equipe', routeEquipe);
app.use('/event', routeEvent);
app.use('/bar', routeBar);

const swaggerJsDoc = require('swagger-jsdoc');
const swagerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS API project for supcup backend',
            version: '1.0.0'
        }, 
        servers: [
            {
                url:  'http://localhost:5001/'
            }
        ]
    }, 
    apis: ['./routes/*.js'] 
}

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swagerUi.serve, swagerUi.setup(swaggerSpec))


// Global routes
app.get('/', (req, res) => {
    res.status(200).send('Hello world !');
});

app.get('/test', (req, res) => {
    res.status(200).send('Test !');
});

app.listen(port, () => {
    console.log('Server listen on http://localhost:5001');
});