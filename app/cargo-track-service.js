/**
 * Created by ikonovalov on 11/01/17.
 */

class CargoTrackService {

    constructor(db) {
        this.db = db;
    }

    lookupCurrentLocation(trackNumber, cb) {
        this.db.findOne({_id: trackNumber}, cb)
    }

    newTrack(trackNumber) {
        this.updateTrack(trackNumber, {
            _id: trackNumber,
            locationName: 'RU/VLADIVOSTOK',
            startLocation: 'RU/VLADIVOSTOK',
            endLocation: 'RU/MOSKVA',
            complete: false
        })
    }

    updateTrack(trackNumber, info, cb) {
        info._id = trackNumber;
        this.db.update({_id: trackNumber}, info, {upsert: true}, cb);
    }

}

module.exports = CargoTrackService;
