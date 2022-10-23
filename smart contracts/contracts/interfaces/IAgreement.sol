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

    event NFTReturnedAgreement(
        address indexed owner,
        address indexed borrower,
        uint256 indexed itemId,
        address nftAddress,
        address agreement
    );
    event CollateralWithdrawed(
        address indexed owner,
        address indexed borrower,
        uint256 indexed itemId,
        address agreement,
        uint256 collateral
    );
    event NewAgreementProposal(
        address indexed owner,
        address indexed borrower,
        address indexed agreement,
        uint256 collateral,
        uint256 rentDays,
        uint256 price
    );
    event AcceptedNewAgreement(
        address indexed owner,
        address indexed borrower,
        address indexed agreement,
        address approver,
        uint256 collateral,
        uint256 rentDays,
        uint256 price
    );
    event AgreementReceipt(
        address indexed owner,
        address indexed borrower,
        string indexed CID,
        string CIDClearText,
        address agreement,
        string status
    );

    error AgreementNotEnoughFunds(
        uint256 availableFunds,
        uint256 requiredFunds
    );
    error AgreementNotExpired(uint256 endTime, uint256 timestamp);
    error AgreementAccessDenied(address caller);

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

    function returnNft(string calldata _CID) external payable;

    function withdrawCollateral(string calldata _CID) external;

    function getElasticAddress() external view returns (address);
}
