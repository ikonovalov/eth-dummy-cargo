const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const ethCargoOracle = require('./ethereum/eth-cargo-oracle');

const NeDB = require('nedb');
const tracksDb = new NeDB({filename: path.join(__dirname, 'db/tracks.nedb'), autoload: true});

const CargoTrackerService = require('./app/cargo-track-service');
const cargoService = new CargoTrackerService(tracksDb);

// setup eth event listener
ethCargoOracle.newTrackEvent.watch((error, event) => {
    if (!error) {
        cargoService.newTrack(event.args.trackNumber);
    }
});

const trackRoute = require('./routes/track-rt')(cargoService);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({extended: false}));

let trackRoutePath = '/track';
app.use(trackRoutePath, trackRoute);
console.log(`HTTP Cargo tracking service registered under  ${trackRoutePath}`);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
});

module.exports = app;
