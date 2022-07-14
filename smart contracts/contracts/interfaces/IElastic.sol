// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IElastic {
    function unlistNFT(uint256 _itemId) external;

    function updateNFTRentedToReturn(uint256 _itemId) external;
}