require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const { PORT = 3000, COMPANY } = process.env;
const router = require('./routes');
const { mongoUrl, mongoAtlas } = require('./config');
const errorHandler = require('./middlewares/errorhandler');
const log = require('./utils/log');

log(`Connecting db ${mongoAtlas ? 'MONGOATLAS' : 'localhost'}...`);
mongoose.connect(mongoAtlas || mongoUrl, {useNewUrlParser:true})
    .then(connection => {
        log('database connected');
    })
    .catch(err => {
        log('database not connected');
    })

//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/logs', express.static(path.join(__dirname, 'logs')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res, next) => {
    res.json({ message: `Welcome to ${COMPANY}` });
})

app.use('/', router);

app.use(errorHandler);

module.exports = app;

app.listen(PORT, () => {
    log('app is listening on port,', PORT)
})