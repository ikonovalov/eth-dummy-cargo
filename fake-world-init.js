/**
 * Created by ikonovalov on 20/01/17.
 */
"use strict";
const path = require('path');
const NeDB = require('nedb');
const fs = require('fs');

let dbPath = path.join(__dirname, 'db/tracks.nedb');

// recreate database
fs.unlinkSync(dbPath);
const tracksDb = new NeDB({filename: dbPath, autoload: true});

const store = (object) => {
    tracksDb.update({_id: object._id}, object, {upsert: true})
};

// initial track numbers setup
let initialStates = [
    {
        _id: 'RU0001RU',
        locationName: 'RU/VLADIVOSTOK',
        startLocation: 'RU/VLADIVOSTOK',
        endLocation: 'RU/MOSKVA',
        complete: false
    },
    {
        _id: 'RU0002RU',
        locationName: 'RU/VLADIVOSTOK',
        startLocation: 'RU/VLADIVOSTOK',
        endLocation: 'RU/PETROPAVLOVSK',
        complete: false
    },
    {
        _id: 'RU0003RU',
        locationName: 'RU/MOSKVA',
        startLocation: 'RU/MOSKVA',
        endLocation: 'RU/IRKUSK',
        complete: false
    },
    {
        _id: 'RU0004RU',
        locationName: 'RU/MOSKVA',
        startLocation: 'RU/MOSKVA',
        endLocation: 'RU/IRKUSK',
        complete: false
    }
];
initialStates.forEach(state => store(state));