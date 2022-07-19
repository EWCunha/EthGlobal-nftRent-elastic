// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IAgreement.sol";
import "./interfaces/IElastic.sol";

contract Agreement is IAgreement {
    address public elasticAddress;

    AgreementData agreement;
    NewAgreementData newAgreement;
    string CID;

    error AgreementNotEnoughFunds(
        uint256 availableFunds,
        uint256 requiredFunds
    );
    error AgreementNotExpired(uint256 endTime);
    error AgreementAccessDenied(address caller);

    event NFTReturnedAgreement(
        address indexed agreement,
        address owner,
        address borrower,
        address indexed nftAddress,
        uint256 indexed itemId
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
    event AgreementReceipt(
        address agreement,
        address indexed owner,
        address indexed borrower,
        string indexed CID,
        string CIDClearText,
        string status
    );

    constructor(
        address _elasticAddress,
        address _owner,
        address _borrower,
        uint256 _collateral,
        uint256 _rentTime,
        uint256 _tokenId,
        address _nftAddress,
        uint256 _price,
        uint256 _startTime,
        uint256 _itemId
    ) {
        elasticAddress = _elasticAddress;
        agreement.owner = _owner;
        agreement.borrower = _borrower;
        agreement.collateral = _collateral;
        agreement.rentTime = _rentTime;
        agreement.tokenId = _tokenId;
        agreement.nftAddress = _nftAddress;
        agreement.price = _price;
        agreement.startTime = _startTime;
        agreement.itemId = _itemId;
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
        returns (IAgreement.AgreementData memory)
    {
        return agreement;
    }

    /**
    @notice updateAgreementData allows the owner to update the agreement and change the agreement
    @param _collateral new collateral for the rented NFT
    @param _rentTime new amount of renting time (in seconds) for the rented NFT
    @param _price new rent price value for the rented NFT
    */
    function updateAgreementData(
        uint256 _collateral,
        uint256 _rentTime,
        uint256 _price
    ) external override onlyInvolved {
        newAgreement.collateral = _collateral;
        newAgreement.rentTime = _rentTime;
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
            _rentTime,
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
            agreement.rentTime = newAgreement.rentTime;
            agreement.price = newAgreement.price;

            newAgreement.collateral = 0;
            newAgreement.rentTime = 0;
            newAgreement.price = 0;
            newAgreement.ownerAccepted = false;
            newAgreement.borrowerAccepted = false;
        }

        emit AcceptedNewAgreement(
            address(this),
            msg.sender,
            agreement.collateral,
            agreement.rentTime,
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
            agreement.price;

        if (address(this).balance < totalPaymentAmount) {
            revert AgreementNotEnoughFunds(
                address(this).balance,
                totalPaymentAmount
            );
        }

        IERC721(agreement.nftAddress).transferFrom(
            msg.sender,
            elasticAddress,
            agreement.tokenId
        );

        payable(agreement.owner).transfer(totalPaymentAmount);
        payable(agreement.borrower).transfer(address(this).balance);

        IElastic(elasticAddress).returnNFT(agreement.itemId);

        emit NFTReturnedAgreement(
            address(this),
            agreement.owner,
            agreement.borrower,
            agreement.nftAddress,
            agreement.itemId
        );
        _burnAgreement("NFT Returned");
    }

    /**
    @notice withdrawCollateral allows NFT owner to get the collateral, if the borrower does not return the NFT back at the agreed time
    */
    function withdrawCollateral() external override onlyOwner {
        if (agreement.startTime + agreement.rentTime < block.timestamp) {
            revert AgreementNotExpired(
                agreement.startTime + agreement.rentTime
            );
        }

        payable(msg.sender).transfer(agreement.collateral);
        payable(elasticAddress).transfer(address(this).balance);

        IElastic(elasticAddress).removeNFT(agreement.itemId);

        emit CollateralWithdrawed(
            address(this),
            agreement.owner,
            agreement.collateral
        );
        _burnAgreement("Collateral withdrawed");
    }

    /**
    @notice writeCID write the CID for IPFS
    @param _CID the new IPFS CID
    */
    function writeCID(string memory _CID) external onlyInvolved {
        CID = _CID;
    }

    /**
    @notice _burnAgreement internal function to burn this smart contract after its end
    */
    function _burnAgreement(string memory _status) internal {
        emit AgreementReceipt(
            address(this),
            agreement.owner,
            agreement.borrower,
            CID,
            CID,
            _status
        );
        selfdestruct(payable(elasticAddress));
    }

    modifier onlyBorrower() {
        if (agreement.borrower != msg.sender) {
            revert AgreementAccessDenied(msg.sender);
        }
        _;
    }

    modifier onlyOwner() {
        if (agreement.owner != msg.sender) {
            revert AgreementAccessDenied(msg.sender);
        }
        _;
    }

    modifier onlyInvolved() {
        if (
            agreement.owner != msg.sender &&
            agreement.borrower != msg.sender &&
            elasticAddress != msg.sender
        ) {
            revert AgreementAccessDenied(msg.sender);
        }
        _;
    }

    fallback() external payable {}

    receive() external payable {}
}
