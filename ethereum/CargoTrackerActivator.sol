pragma solidity ^0.4.8;
import "./CargoTrackerService.sol";
import "./CargoTrackRequester.sol";

contract CargoTrackerActivator is CargoTrackerService {

    uint public constant version = 8;

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

    enum TrackingStatus {
        NOT_EXISTS, /* means not exist/registred */
        UNDER_TRACKING,         // on going
        UNDER_SO_TRACKING,      // on going
        BAD_TRACK_SETUP,        // terminated
        MAX_RETRIES_REACHED,    // suspended
        COMPLETED_SUCCESSFULLY, // terminated
        TOO_HIGH_FREQ           // terminated
    }

    struct TrackingRequest {
        string carrier;
        uint128 frequency;
        uint128 maxRetries;
        TrackingStatus status;
        address[] requestors;
    }

    event NewTrackingRequest(string trackNumber);

    // trackNumber to request
    mapping(string => TrackingRequest) internal trackingRequests;
    uint256 public trackingRequestsCount = 0;

    // frequency - 1/day (2 means one hit in 12 hours)
    // duration: freq = 2, maxRetr = 100 => 100/2 = 50 hours
    function createTrackingRequest(string trackNumber, string carrier, uint128 frequency, uint128 maxRetries) external payable costs(maxRetries * 1 ether) {
        TrackingRequest req = trackingRequests[trackNumber];
        if (req.status == TrackingStatus.NOT_EXISTS) {
            address[]  memory reqs = new address[](1);
            reqs[0] = msg.sender;
            trackingRequests[trackNumber] = TrackingRequest(
                {
                    carrier: carrier,
                    frequency: frequency,
                    maxRetries: maxRetries,
                    status: TrackingStatus.UNDER_TRACKING,
                    requestors: reqs
                }
            );
            trackingRequests[trackNumber].status = TrackingStatus.UNDER_TRACKING;
            trackingRequestsCount++;
            NewTrackingRequest(trackNumber);
        } else {
            req.requestors.push(msg.sender);
            req.status = TrackingStatus.UNDER_SO_TRACKING;
            // TODO: recalculate frequency. New duration can't be less when current.
            //req.maxRetries = req.maxRetries + maxRetries;
        }
    }

    function maxRetriesReached(string trackNumber) onlyOperator {
        TrackingRequest req = trackingRequests[trackNumber];
        if (req.status == TrackingStatus.UNDER_TRACKING) {
            req.status = TrackingStatus.MAX_RETRIES_REACHED;
            trackingRequestsCount--;
            for (uint i = 0; i < req.requestors.length; i++) {
                CargoTrackRequester(req.requestors[i]).maxRetriesReached(trackNumber);
            }
        }
    }

    // it can be done externally by oracle (call requestors directly)
    function updateTrackForRequestor(string trackNumber, string info) onlyOperator {
        TrackingRequest req = trackingRequests[trackNumber];
        for (uint i = 0; i < req.requestors.length; i++) {
            CargoTrackRequester(req.requestors[i]).updateTrack(info);
        }
    }

    function getRequestorsFromTrack(string trackNumber) constant returns (address[]) {
        return trackingRequests[trackNumber].requestors;
    }

    function getTrackingRequest(string trackNumber) constant returns(
                    string carrier,
                    uint128 frequency,
                    uint128 maxRetries,
                    uint status,
                    address[] requestors
    ) {
        TrackingRequest req = trackingRequests[trackNumber];
        if (req.status != TrackingStatus.NOT_EXISTS) {
            carrier = req.carrier;
            frequency = req.frequency;
            maxRetries = req.maxRetries;
            status = uint(req.status);
            requestors = req.requestors;
        }
    }

    // support functions ==============================
    modifier onlyOperator() {
        if (msg.sender != owner)
            throw;
        _;
    }

    modifier costs(uint _amount) {
        if (msg.value < _amount)
            throw;
        _;
        if (msg.value > _amount && msg.sender.send(msg.value - _amount)) {
                cash += _amount;
        }
    }

}
