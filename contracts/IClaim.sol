// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

interface IAirdropERC20Claimable {
    event TokensClaimed(address indexed claimer, address indexed receiver, uint256 quantityClaimed);

    function claim(
        address receiver,
        uint256 quantity,
        bytes32[] calldata proofs,
        uint256 proofMaxQuantityForWallet
    ) external;
}
