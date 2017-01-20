/**
 * Created by ikonovalov on 20/01/17.
 */
"use strict";
const path = require('path');
const NeDB = require('nedb');

const tracksDb = new NeDB({filename: path.join(__dirname, 'db/tracks.nedb'), autoload: true});

const store = (object) => {
    tracksDb.update({_id: object._id}, object, {upsert: true})
};

let initialStates = [
    {
        _id: 'RU0001RU',
        locationName: 'RU/VLADIVOSTOK',
        startLocation: 'RU/VLADIVOSTOK',
        endLocation: 'RU/MOSKVA',
        comptlete: false
    },
    {
        _id: 'RU0002RU',
        locationName: 'RU/VLADIVOSTOK',
        startLocation: 'RU/VLADIVOSTOK',
        endLocation: 'RU/PETROPAVLOVSK',
        comptlete: false
    },
    {
        _id: 'RU0003RU',
        locationName: 'RU/MOSKVA',
        startLocation: 'RU/MOSKVA',
        endLocation: 'RU/IRKUSK',
        comptlete: false
    }
];
initialStates.forEach(state => store(state));