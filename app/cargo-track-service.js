/**
 * Created by ikonovalov on 11/01/17.
 */

class CargoTrackService {

    constructor(db) {
        this.db = db;
    }

    lookupCurrentLocation(trackNumber) {
        return {
            locationName: 'RU/Moscow',
            latitude: '55.755833',
            longitude: '37.617778'
        }
    }

}

module.exports = function(db) {
    return new CargoTrackService(db)
};