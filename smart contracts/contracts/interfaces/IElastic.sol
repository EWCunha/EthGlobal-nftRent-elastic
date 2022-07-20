// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IElastic {
    function removeNFT(uint256 _itemId, string calldata _CID) external;

    function returnNFT(uint256 _itemId, string calldata _CID) external;
}
