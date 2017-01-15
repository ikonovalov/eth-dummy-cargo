pragma solidity ^0.4.6;

contract CargoTrackerActivator {

    uint32 public constant version = 1;

    modifier costs(uint _amount) {
        if (msg.value < _amount)
            throw;
        _;
        if (msg.value > _amount)
            msg.sender.send(msg.value - _amount);
    }

    enum TrackingStatus {
        NOT_EXISTS, /* means not exist/registred */
        UNDER_TRACKING,
        BAD_TRACK_SETUP,
        MAX_REPS_REACHED,
        COMPLETED_SUCCESSFULLY
    }

    struct TrackingRequest {
        address requester;
        string carrier;
        uint128 frequency;
        uint128 maxReps;
        TrackingStatus status;
    }

    // trackNumber to request
    mapping(string => TrackingRequest) internal trackingRequests;

    function createTrackingService(string trackNumber, string carrier, uint128 frequency, uint128 maxReps) external payable costs(maxReps * 1 ether) {
        TrackingRequest req = trackingRequests[trackNumber];
        if (req.status == TrackingStatus.NOT_EXISTS) {
            trackingRequests[trackNumber] = TrackingRequest(msg.sender, carrier, frequency, maxReps, TrackingStatus.UNDER_TRACKING);
        }
    }

}

contract CargoTrackRequester {
    function updateTrack(string information);
}
