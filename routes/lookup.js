/**
 * Created by ikonovalov on 11/01/17.
 */
const express = require('express');
const router = express.Router();

module.exports = function (cargoService) {

    router.get('/:trackNumber', function(req, res) {
        let currentLocation = cargoService.lookupCurrentLocation(req.param.trackNumber);
        res.send(currentLocation)
    });

    return router
};




