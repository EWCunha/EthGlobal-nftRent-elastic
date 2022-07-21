// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IAgreement {
    struct AgreementData {
        address owner;
        address borrower;
        address nftAddress;
        uint256 tokenId;
        uint256 itemId;
        uint256 collateral;
        uint256 price;
        uint256 rentTime;
        uint256 startTime;
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

    function returnNFT(string calldata _CID) external payable;

    function withdrawCollateral(string calldata _CID) external;

    function getElasticAddress() external view returns (address);
}
