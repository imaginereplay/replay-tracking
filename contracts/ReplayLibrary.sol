// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library ReplayLibrary {

    struct Transaction {
        address userId;
        uint256 day;
        uint256 month;
        uint256 year;
        uint256 totalDuration;
        uint256 totalRewardsConsumer;
        uint256 totalRewardsContentOwner;
        string assetId;
    }

    function encodeKey(
        address userId,
        uint256 day,
        uint256 month,
        uint256 year,
        string memory assetId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(userId, day, month, year, assetId));
    }
}
