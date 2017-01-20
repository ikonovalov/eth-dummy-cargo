/**
 * Created by ikonovalov on 20/01/17.
 */
"use strict";
const path = require('path');
const NeDB = require('nedb');

const tracksDb = new NeDB({filename: path.join(__dirname, 'db/tracks.nedb'), autoload: true});

const transSiberia = [
    'RU/VLADIVOSTOK',
    'RU/USSURIYSK',
    'RU/HARBIN',
    'RU/ZABAYKALSK',
    'RU/CHITA',
    'RU/IRKUTSK',
    'RU/KRASNOYARSK',
    'RU/NOVOSIBIRSK',
    'RU/OMSK',
    'RU/PETROPAVLOVSK',
    'RU/KURGAN',
    'RU/CHELYABINKS',
    'RU/MIASS',
    'RU/ZLATOUST',
    'RU/UFA',
    'RU/SAMARA',
    'RU/SYZRAN',
    'RU/PENZA',
    'RU/RYAZHSK',
    'RU/MOSKVA'
];

const vladivostokToMsk = transSiberia;
const mskToVladivostok = transSiberia.reverse();

const direction = (track) => {
    let mskdistance = 0;
    let vladdistance = mskToVladivostok.length;
    let startLocation = track.startLocation;
    let endLocation = track.endLocation;
    for (let i = 0; i < mskToVladivostok.length; i++) {
        if (mskToVladivostok[i] === startLocation) {
            mskdistance = i;
        }
        if(mskToVladivostok[i] === endLocation) {
            vladdistance = i;
        }
    }
    console.log(mskdistance);
    return mskdistance > vladdistance ? 'EAST' : 'WEST';
};

tracksDb.find({}, (err, locations) => {
    locations.forEach(cargoLocation => {
        switch (direction(cargoLocation)) {
            case 'EAST': {

                break;
            }
            case 'WEST': {

                break;
            }
        }
    })
});

