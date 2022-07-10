// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Elastic is Ownable {
    struct NFTData {
        address tenant;
        address owner;
        uint256 tokenId;
        uint256 collateral;
        uint256 daysToRent;
        uint256 ratePerDay;
        bytes32[] benefits;
    }

    uint256 itemCount;

    NFTData[] itemList;
    mapping(address => NFTData) nftData;
    mapping(uint256 => address) itemAddress;

    error InvalidAddress();
    error InvalidBalance();
    error executionFailed();

    event NFTListed(
        address indexed owner,
        uint256 collateral,
        uint256 daysToRent
    );

    event NFTRented(address indexed tenant, address indexed item);

    /**
    @notice depositToRent allows owner of NFT to list his nft to the marketplace
    @param _nft address of ERC721
    @param _tokenId ERC721's tokenID
    @param _dayToRent number of days the owner would like to rent his NFT
    @param _price desire price for the full period
    @param _benefits list of the benifits the listed NFT grant
    */

    function depositToRent(
        address _nft,
        uint256 _tokenId,
        uint256 _dayToRent,
        uint256 _price,
        bytes32[] calldata _benefits
    ) external {
        if (IERC721(_nft).ownerOf(_tokenId) != msg.sender) {
            revert InvalidAddress();
        }
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);
        // we should consider collateral as 110%
        uint256 collateral = _price + _price / 10;
        // determine the daily rate. it will serve in case the tenant returns NFT before deadline
        uint256 ratePerDay = collateral / _dayToRent;
        // add new item to the marketpalce
        NFTData memory item = NFTData(
            address(0),
            msg.sender,
            _tokenId,
            collateral,
            _dayToRent,
            ratePerDay,
            _benefits
        );
        itemList.push(item);
        itemAddress[itemCount] = _nft;
        unchecked {
            itemCount++;
        }
        emit NFTListed(msg.sender, collateral, _dayToRent);
    }

    /** 
    @notice tenant rent the NFT list on the platform
    @param _itemId id of the NFT on the listed on the platform
    */
    function rent(uint256 _itemId) external {
        uint256 balance = address(msg.sender).balance;
        NFTData memory item = itemList[_itemId];
        if (item.collateral > balance) {
            revert InvalidBalance();
        }
        (bool success, ) = msg.sender.call{value: item.collateral}("");
        if (!success) {
            revert executionFailed();
        }
        item.tenant = msg.sender;
        // transfer to NFT to the tenant
        address _nft = itemAddress[_itemId];
        // todo , create agreement contract and deploy it , with the data
        // transfer NFT to tenant
        IERC721(_nft).transferFrom(address(this), msg.sender, item.tokenId);
        emit NFTRented(msg.sender, _nft);
    }
}
