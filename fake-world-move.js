/**
 * Created by ikonovalov on 20/01/17.
 */
"use strict";
const path = require('path');
const NeDB = require('nedb');

const tracksDb = new NeDB({filename: path.join(__dirname, 'db/tracks.nedb'), autoload: true});

const transSiberia = require('./app/transsiberia');

const vladivostokToMsk = transSiberia;
const mskToVladivostok = Array.from(vladivostokToMsk);
mskToVladivostok.reverse();

const detectDirection = (currentLocation) => {
    let mskdistance = 0;
    let vladdistance = mskToVladivostok.length;
    let startLocation = currentLocation.startLocation;
    let endLocation = currentLocation.endLocation;
    for (let i = 0; i < mskToVladivostok.length; i++) {
        if (mskToVladivostok[i] === startLocation) {
            mskdistance = i;
        }
        if(mskToVladivostok[i] === endLocation) {
            vladdistance = i;
        }
    }
    return mskdistance > vladdistance ? 'WEST' : 'EAST';
};

const nextPoint = (location, direction) => {
    if (location.complete === false) {
        let path = direction == 'EAST' ? mskToVladivostok : vladivostokToMsk;
        let currentLocationIndex = path.findIndex(e => location.locationName === e);
        let nextLocationIndex = currentLocationIndex + 1;
        let nextLocation = path[nextLocationIndex];
        let isFinal = (currentLocationIndex + 2) == (path.length);
        return {
            next: nextLocation,
            isFinal: isFinal
        };
    } else {
        return {
            next: location.locationName,
            isFinal: true
        }
    }
};

tracksDb.find({}, (err, locations) => {
    locations.forEach(cargoLocation => {
        if (cargoLocation.complete)
            return;
        let direction =  detectDirection(cargoLocation);
        let nextCargoPoint = nextPoint(cargoLocation, direction);
        cargoLocation.locationName = nextCargoPoint.next;
        cargoLocation.complete = nextCargoPoint.isFinal;
        tracksDb.update({_id: cargoLocation._id}, cargoLocation, (e, r) => {
            if (!e && r === 1)
                console.log(
                    `Cargo: ${cargoLocation._id}
                    \t${cargoLocation.complete ? '[ARRIVED]' : '[MOVING]'}
                    \t${cargoLocation.locationName}`
                );
            else
                throw e;
        });
    })
});

