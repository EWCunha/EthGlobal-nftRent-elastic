// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IAgreement.sol";

contract Agreement is IAgreement {
    address public elasticAddress;

    AgreementData agreement;
    NewAgreementData newAgreement;

    constructor(
        address _elasticAddress,
        address _owner,
        address _borrower,
        uint256 _collateral,
        uint256 _rentDays,
        uint256 _tokenId,
        address _nftAddress,
        uint256 _proposalId,
        uint256 _price
    ) {
        elasticAddress = _elasticAddress;
        agreement.owner = _owner;
        agreement.borrower = _borrower;
        agreement.collateral = _collateral;
        agreement.rentDays = _rentDays;
        agreement.tokenId = _tokenId;
        agreement.nftAddress = _nftAddress;
        agreement.proposalId = _proposalId;
        agreement.price = _price;
        agreement.startTime = block.timestamp;
    }

    /**
    @notice readPayment allows the owner, the borrower, and the broker smart contract to read the required payment amount so far
    */
    function readPayment()
        external
        view
        override
        onlyInvolved
        returns (uint256)
    {
        uint256 totalPaymentAmount = (block.timestamp - agreement.startTime) *
            agreement.price;
        return totalPaymentAmount;
    }

    /**
    @notice readAgreementData returns the data of this agreement
    */
    function readAgreementData()
        external
        view
        override
        onlyInvolved
        returns (IAgreement.AgreementData memory)
    {
        return agreement;
    }

    /**
    @notice updateAgreementData allows the owner to update the agreement and change the agreement
    @param _collateral new collateral for the rented NFT
    @param _rentDays new amount of renting days for the rented NFT
    @param _price new rent price value for the rented NFT
    */
    function updateAgreementData(
        uint256 _collateral,
        uint256 _rentDays,
        uint256 _price
    ) external override onlyInvolved {
        newAgreement.collateral = _collateral;
        newAgreement.rentDays = _rentDays;
        newAgreement.price = _price;
        newAgreement.ownerAccepted = msg.sender == agreement.owner
            ? true
            : false;
        newAgreement.borrowerAccepted = msg.sender == agreement.borrower
            ? true
            : false;
    }

    /**
    @notice acceptUpdatedAgreementData allows the borrower or the owner to accept the new proposed agreement
    */
    function acceptUpdatedAgreementData() external override onlyInvolved {
        newAgreement.ownerAccepted = msg.sender == agreement.owner
            ? true
            : false;
        newAgreement.borrowerAccepted = msg.sender == agreement.borrower
            ? true
            : false;

        if (newAgreement.ownerAccepted && newAgreement.borrowerAccepted) {
            agreement.collateral = newAgreement.collateral;
            agreement.rentDays = newAgreement.rentDays;
            agreement.price = newAgreement.price;
        }
    }

    /**
    @notice returnNFT the borrower should use this function to return the rented NFT, pay the rent price, and receive the collateral back
    */
    function returnNFT() external payable override onlyBorrower {
        uint256 totalPaymentAmount = (block.timestamp - agreement.startTime) *
            agreement.price;

        require(
            address(this).balance >= totalPaymentAmount,
            "Not enough funds"
        );

        IERC721(agreement.nftAddress).transferFrom(
            msg.sender,
            elasticAddress,
            agreement.tokenId
        );

        payable(agreement.owner).transfer(totalPaymentAmount);
        payable(agreement.borrower).transfer(address(this).balance);

        _burnAgreement();
    }

    /**
    @notice takeCollateral allows NFT owner to get the collateral, if the borrower does not return the NFT back at the agreed time
    */
    function takeCollateral() external override onlyOwner {
        require(
            agreement.startTime + agreement.rentDays * 24 * 60 * 60 >=
                block.timestamp,
            "Cannot take collateral before agreement end"
        );

        payable(msg.sender).transfer(address(this).balance);

        _burnAgreement();
    }

    /**
    @notice _burnAgreement internal function to burn this smart contract after its end
    */
    function _burnAgreement() internal {
        selfdestruct(elasticAddress);
    }

    modifier onlyBorrower() {
        require(agreement.borrower == msg.sender, "access denied");
        _;
    }

    modifier onlyOwner() {
        require(agreement.owner == msg.sender, "access denied");
        _;
    }

    modifier onlyInvolved() {
        require(
            agreement.owner == msg.sender ||
                agreement.borrower == msg.sender ||
                elasticAddress == msg.sender,
            "access denied"
        );
        _;
    }
}
