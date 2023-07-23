const express = require('express');

const app = express();
const port = 5001;

app.get('/', (req, res) => {
    res.status(200).send('Hello world !');
});

app.listen(port, () => {
    console.log('Server listen on http://localhost:5001');
});