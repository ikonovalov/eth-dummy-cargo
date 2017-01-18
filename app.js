const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const ethCargoTracker = require('./ethereum/eth-cargo-tracker');

const NeDB = require('nedb')
const tracksDb = new NeDB({filename: path.join(__dirname, 'db/tracks.nedb'), autoload: true});

const cargoService = require('./app/cargo-track-service')(tracksDb, ethCargoTracker);

const index = require('./routes/index');
const lookup = require('./routes/lookup')(cargoService);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/lookup', lookup);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
