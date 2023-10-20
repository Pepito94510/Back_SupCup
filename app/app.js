const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

// Add route require here
const routesUser = require('./routes/user');
const routeSport = require('./routes/sport');
const routeEquipe = require('./routes/equipe');
const routeEvent = require('./routes/event');

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