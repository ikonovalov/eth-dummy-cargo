"use strict"

const Web3 = require('web3');
const web3 = new Web3();
const eth_rpc = 'http://localhost:8545';

const location = '0x0f163dca69069e7146776c5b51449607e10f1957';
const abi = [{"constant":true,"inputs":[{"name":"trackNumber","type":"string"}],"name":"getTrackingRequest","outputs":[{"name":"carrier","type":"string"},{"name":"frequency","type":"uint128"},{"name":"maxRetries","type":"uint128"},{"name":"status","type":"uint256"},{"name":"requestors","type":"address[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"trackNumber","type":"string"},{"name":"carrier","type":"string"},{"name":"frequency","type":"uint128"},{"name":"maxRetries","type":"uint128"}],"name":"createTrackingRequest","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"cash","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"trackNumber","type":"string"}],"name":"maxRetriesReached","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"trackNumber","type":"string"},{"name":"info","type":"string"}],"name":"updateTrackForRequestor","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"trackingRequestsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdrawal","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"trackNumber","type":"string"}],"name":"getRequestorsFromTrack","outputs":[{"name":"","type":"address[]"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"trackNumber","type":"string"}],"name":"NewTrackingRequest","type":"event"}];

web3.setProvider(new web3.providers.HttpProvider(eth_rpc));
console.log(`Ethereum HTTP-RPC-Provider set to ${eth_rpc}`);

let trackerContract = web3.eth.contract(abi).at(location);
let trackServiceVersion = trackerContract.version().toNumber();
console.log(`CargoOracle on "${location}" has version: ${trackServiceVersion}`)

let newTrackEvent = trackerContract.NewTrackingRequest({}, {fromBlock: web3.eth.blockNumber});
module.exports = {
    web3: web3,
    abi: abi,
    location: location,
    contract: trackerContract,
    version: trackServiceVersion,
    newTrackEvent: newTrackEvent
};
