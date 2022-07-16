// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IAgreement.sol";
import "./interfaces/IElastic.sol";

contract Agreement is IAgreement {
    address public elasticAddress;

    AgreementData agreement;
    NewAgreementData newAgreement;

    event NFTReturned(
        address indexed agreement,
        address owner,
        address borrower,
        address indexed nftAddress,
        uint256 indexed tokenId
    );
    event CollateralWithdrawed(
        address indexed agreement,
        address indexed owner,
        uint256 collateral
    );
    event NewAgreementProposal(
        address indexed agreement,
        uint256 collateral,
        uint256 rentDays,
        uint256 price
    );
    event AcceptedNewAgreement(
        address indexed agreement,
        address indexed approver,
        uint256 collateral,
        uint256 rentDays,
        uint256 price
    );

    constructor(
        address _elasticAddress,
        address _owner,
        address _borrower,
        uint256 _collateral,
        uint256 _rentDays,
        uint256 _tokenId,
        address _nftAddress,
        uint256 _price,
        uint256 _startTime
    ) {
        elasticAddress = _elasticAddress;
        agreement.owner = _owner;
        agreement.borrower = _borrower;
        agreement.collateral = _collateral;
        agreement.rentDays = _rentDays;
        agreement.tokenId = _tokenId;
        agreement.nftAddress = _nftAddress;
        agreement.price = _price;
        agreement.startTime = _startTime;
    }

    function getElasticAddress() public view returns (address) {
        return elasticAddress;
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

        emit NewAgreementProposal(
            address(this),
            _collateral,
            _rentDays,
            _price
        );
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

            newAgreement.collateral = 0;
            newAgreement.rentDays = 0;
            newAgreement.price = 0;
            newAgreement.ownerAccepted = false;
            newAgreement.borrowerAccepted = false;
        }

        emit AcceptedNewAgreement(
            address(this),
            msg.sender,
            agreement.collateral,
            agreement.rentDays,
            agreement.price
        );
    }

    /**
    @notice readUpdatedAgreement allows the owner, the borrower, and the broker contract to read the new agreement proposal
    */
    function readUpdatedAgreement()
        external
        view
        override
        onlyInvolved
        returns (NewAgreementData memory)
    {
        return newAgreement;
    }

    /**
    @notice returnNFT the borrower should use this function to return the rented NFT, pay the rent price, and receive the collateral back
    */
    function returnNFT() external payable override onlyBorrower {
        uint256 totalPaymentAmount = (block.timestamp - agreement.startTime) *
            (agreement.price / (24 * 60 * 60));

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

        IElastic(elasticAddress).updateNFTRentedToReturn(agreement.tokenId);

        emit NFTReturned(
            address(this),
            agreement.owner,
            agreement.borrower,
            agreement.nftAddress,
            agreement.tokenId
        );
        _burnAgreement();
    }

    /**
    @notice withdrawCollateral allows NFT owner to get the collateral, if the borrower does not return the NFT back at the agreed time
    */
    function withdrawCollateral() external override onlyOwner {
        require(
            agreement.startTime + agreement.rentDays * 24 * 60 * 60 >=
                block.timestamp,
            "Cannot take collateral before agreement end"
        );

        payable(msg.sender).transfer(agreement.collateral);
        payable(elasticAddress).transfer(address(this).balance);

        IElastic(elasticAddress).unlistNFT(agreement.tokenId);

        emit CollateralWithdrawed(
            address(this),
            agreement.owner,
            agreement.collateral
        );
        _burnAgreement();
    }

    /**
    @notice _burnAgreement internal function to burn this smart contract after its end
    */
    function _burnAgreement() internal {
        selfdestruct(payable(elasticAddress));
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

    fallback() external payable {}
}
