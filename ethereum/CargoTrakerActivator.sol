pragma solidity ^0.4.8;

contract CargoTrackerService {
  function createTrackingRequest(string trackNumber, string carrier, uint128 frequency, uint128 maxReps) external payable;
}

contract CargoTrackRequester {
    function updateTrack(string information);
}

contract CargoTrackerActivator is CargoTrackerService {

    uint32 public constant version = 7;

    address public owner;

    uint public cash = 0;

    function CargoTrackerActivator() {
        owner = msg.sender;
    }

    function withdrawal() {
        if (msg.sender == owner && msg.sender.send(cash)) {
            cash = 0;
        }
    }

    modifier costs(uint _amount) {
        if (msg.value < _amount)
            throw;
        _;
        if (msg.value > _amount && msg.sender.send(msg.value - _amount)) {
                cash += _amount;
        }
    }

    enum TrackingStatus {
        NOT_EXISTS, /* means not exist/registred */
        UNDER_TRACKING,
        BAD_TRACK_SETUP,
        MAX_REPS_REACHED,
        COMPLETED_SUCCESSFULLY
    }

    struct TrackingRequest {
        string carrier;
        uint128 frequency;
        uint128 maxReps;
        TrackingStatus status;
        address[] requestors;
    }

    // trackNumber to request
    mapping(string => TrackingRequest) internal trackingRequests;
    uint256 public trackingRequestsCount = 0;

    // frequency - minutes
    function createTrackingRequest(string trackNumber, string carrier, uint128 frequency, uint128 maxReps) external payable costs(maxReps * 1 ether) {
        TrackingRequest req = trackingRequests[trackNumber];
        if (req.status == TrackingStatus.NOT_EXISTS) {
            address[]  memory reqs = new address[](1);
            reqs[0] = msg.sender;
            trackingRequests[trackNumber] = TrackingRequest(
                {
                    carrier: carrier,
                    frequency: frequency,
                    maxReps: maxReps,
                    status: TrackingStatus.UNDER_TRACKING,
                    requestors: reqs
                }
            );
            trackingRequests[trackNumber].status = TrackingStatus.UNDER_TRACKING;
            trackingRequestsCount++;
        } else {
            req.requestors.push(msg.sender);
            req.maxReps = req.maxReps + maxReps;
        }
    }

    function getRequestorsFromTrack(string trackNumber) constant returns (address[]) {
        return trackingRequests[trackNumber].requestors;
    }

    function getTrackRequest(string trackNumber) constant returns(
                    string carrier,
                    uint128 frequency,
                    uint128 maxRetr,
                    uint status,
                    address[] requestors
    ) {
        TrackingRequest req = trackingRequests[trackNumber];
        if (req.status != TrackingStatus.NOT_EXISTS) {
            carrier = req.carrier;
            frequency = req.frequency;
            maxRetr = req.maxReps;
            status = uint(req.status);
            requestors = req.requestors;
        }
    }

}
