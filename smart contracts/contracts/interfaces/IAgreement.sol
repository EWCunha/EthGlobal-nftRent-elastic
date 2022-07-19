// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IAgreement {
    struct AgreementData {
        address owner;
        address borrower;
        uint256 collateral;
        uint256 rentTime;
        uint256 tokenId;
        address nftAddress;
        uint256 price;
        uint256 startTime;
        uint256 itemId;
    }

    struct NewAgreementData {
        uint256 collateral;
        uint256 rentTime;
        uint256 price;
        bool ownerAccepted;
        bool borrowerAccepted;
    }

    function readPayment() external view returns (uint256);

    function readAgreementData() external view returns (AgreementData memory);

    function updateAgreementData(
        uint256 _collateral,
        uint256 _rentTime,
        uint256 _price
    ) external;

    function acceptUpdatedAgreementData() external;

    function readUpdatedAgreement()
        external
        view
        returns (NewAgreementData memory);

    function returnNFT() external payable;

    function withdrawCollateral() external;

    function getElasticAddress() external returns (address);
}
