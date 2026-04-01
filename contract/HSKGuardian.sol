// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HSKGuardian {
    address public owner;

    struct ActionLog {
        address wallet;
        string actionType;
        string result;
        uint256 timestamp;
    }

    ActionLog[] public logs;

    event ActionRecorded(
        address indexed wallet,
        string actionType,
        string result,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    function recordAction(
        address wallet,
        string calldata actionType,
        string calldata result
    ) external {
        logs.push(ActionLog({
            wallet: wallet,
            actionType: actionType,
            result: result,
            timestamp: block.timestamp
        }));
        emit ActionRecorded(wallet, actionType, result, block.timestamp);
    }

    function getLogsCount() external view returns (uint256) {
        return logs.length;
    }

    function getLog(uint256 index) external view returns (
        address wallet,
        string memory actionType,
        string memory result,
        uint256 timestamp
    ) {
        ActionLog storage log = logs[index];
        return (log.wallet, log.actionType, log.result, log.timestamp);
    }
}
