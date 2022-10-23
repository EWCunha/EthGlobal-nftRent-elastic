// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IElastic {
    struct NFTData {
        address nftAddress;
        uint256 tokenId;
        uint256 collateral;
        uint256 price;
        address owner;
        bool rented;
        string benefits;
    }

    struct RentedNFT {
        address agreementAddress;
        address borrower;
        uint256 rentTime;
        uint256 startTime;
    }

    event NFTListed(
        address indexed owner,
        uint256 indexed itemId,
        string tokenURI,
        string indexed benefits,
        string benefitsClearText,
        address nftAddress,
        uint256 tokenId
    );
    event NFTUnlisted(address indexed owner, uint256 indexed itemId);
    event ListedNFTDataModified(
        address indexed owner,
        uint256 indexed itemId,
        uint256 collateral,
        uint256 price
    );
    event NFTRented(
        address indexed owner,
        address indexed tenant,
        uint256 indexed itemId,
        address agreementAddress,
        address nftAddress,
        uint256 tokenId,
        uint256 rentTime,
        uint256 startTime
    );
    event NFTReturned(
        address indexed owner,
        address indexed tenant,
        uint256 indexed itemId,
        address agreement,
        string CID
    );
    event NFTRemoved(
        address indexed owner,
        address indexed borrower,
        uint256 indexed itemId,
        address agreement,
        string CID
    );

    error NotOwner(address caller);
    error NFTAlreadyListedByOwner(
        address owner,
        address nft,
        uint256 tokenId,
        uint256 itemId
    );
    error AccessDenied(uint256 itemId, address caller);
    error AlreadyRented(
        address agreementAddress,
        address borrower,
        uint256 rentTime,
        uint256 startTime
    );
    error InvalidItemId(uint256 itemId);
    error NotActive(uint256 itemId);
    error LowAmount(uint256 itemId, uint256 rightAmount, uint256 wrongAmount);

    function listNft(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price,
        uint256 _collateral,
        string calldata _benefits
    ) external;

    function unlistNft(uint256 _itemId) external;

    function modifyListedNft(
        uint256 _itemId,
        uint256 _collateral,
        uint256 _price
    ) external;

    function rentNft(uint256 _itemId, uint256 _rentTime) external payable;

    function returnNft(uint256 _itemId, string calldata _CID) external;

    function removeNft(uint256 _itemId, string calldata _CID) external;
}
