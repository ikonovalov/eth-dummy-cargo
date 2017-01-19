/**
 * Created by ikonovalov on 11/01/17.
 */

class CargoTrackService {

    constructor(db, trackContract) {
        this.db = db;
        this.ethCargoTracker = trackContract;
    }

    lookupCurrentLocation(trackNumber, cb) {
        this.db.findOne({_id: trackNumber}, cb)
    }

    updateTrack(trackNumber, info, cb) {
        info._id = trackNumber;
        this.db.update({_id: trackNumber}, info, {upsert: true}, cb);
    }

}

module.exports = CargoTrackService;
