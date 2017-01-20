const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const ethCargoTracker = require('./ethereum/eth-cargo-tracker');

const NeDB = require('nedb');
const tracksDb = new NeDB({filename: path.join(__dirname, 'db/tracks.nedb'), autoload: true});
const requestsDb = new NeDB({filename: path.join(__dirname, 'db/requests.nedb'), autoload: true});

const CargoTrackerService = require('./app/cargo-track-service');
const cargoService = new CargoTrackerService(tracksDb, ethCargoTracker);

const lookup = require('./routes/track-rt')(cargoService);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({extended: false}));

app.use('/track', lookup);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
});


// ===========================
// var doc = {
//     tn: 'RU0001CN',
//     trk_idx: 0,
//     location: 'VLADIVOSTOK',
//     carrier: 'RZD'
// };
//
// tracksDb.insert(doc, function (err, newDoc) {
//     console.log(newDoc);
// });

// ===========================

module.exports = app;
