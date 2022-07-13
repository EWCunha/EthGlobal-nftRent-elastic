// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IAgreement {
    struct AgreementData {
        address owner;
        address borrower;
        uint256 collateral;
        uint256 rentDays;
        uint256 tokenId;
        address nftAddress;
        uint256 proposalId;
        uint256 price;
        uint256 startTime;
    }

    struct NewAgreementData {
        uint256 collateral;
        uint256 rentDays;
        uint256 price;
        bool ownerAccepted;
        bool borrowerAccepted;
    }

    function readPayment() external view returns (uint256);

    function readAgreementData() external view returns (AgreementData memory);

    function updateAgreementData(
        uint256 _collateral,
        uint256 _rentDays,
        uint256 _price
    ) external;

    function acceptUpdatedAgreementData() external;

    function readUpdatedAgreement()
        external
        view
        returns (NewAgreementData memory);

    function returnNFT() external payable;

    function withdrawCollateral() external;
}
