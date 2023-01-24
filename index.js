require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const { client } = require('./db');
client.connect();

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json())


server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
});

server.get('/add/:first/to/:second', (req, res, next) => {
    res.send(`<h1>${req.params.first} + ${req.params.second} = ${Number(req.params.first) + Number(req.params.second)
        }</h1>`);
});


server.use('/api', apiRouter);

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});