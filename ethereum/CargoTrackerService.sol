contract CargoTrackerService {
  function createTrackingRequest(string trackNumber, string carrier, uint128 frequency, uint128 maxReps) external payable;
}
