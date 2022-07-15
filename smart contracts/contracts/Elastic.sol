// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAgreement.sol";
import "./Agreement.sol";

contract Elastic is Ownable {
    struct NFTData {
        address owner;
        uint256 tokenId;
        address nftAddress;
        uint256 collateral;
        uint256 pricePerDay;
        bool rented;
        string benefits;
        address agreementAddress;
    }

    uint256 public nextItemId = 1; // 0 is reserved for items no longer listed

    mapping(address => uint256[]) public nftsListedByOwner;
    mapping(address => uint256[]) public borrowersNfts;
    mapping(uint256 => bool) public activeItem;
    mapping(address => mapping(uint256 => bool)) public nftListed;
    mapping(uint256 => NFTData) public items;

    error AccessDenied();
    error NotOwner();
    error AlreadyRented();
    error InvalidId();
    error NotAcceptedProposal();
    error LowAmount();

    event NFTListed(
        address indexed owner,
        uint256 indexed itemId,
        string tokenURI,
        string indexed benefits,
        string benefitsClearText,
        uint256 collateral,
        uint256 price
    );
    event NFTUnlisted(address indexed owner, uint256 indexed itemId);
    event NFTRented(
        address indexed owner,
        address indexed tenant,
        address agreement,
        address itemAddress,
        uint256 indexed itemId
    );
    event ListedNFTDataModified(
        uint256 indexed itemId,
        uint256 collateral,
        uint256 price
    );
    event NFTReturned(uint256 indexed itemId, uint256 timestamp);

    /**
    @notice return the list of item owner by the msg.sender
    @param _owner , address to check 
    */
    function getItemListByOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        return nftsListedByOwner[_owner];
    }

    function getDataItem(uint256 _item) public view returns (NFTData memory) {
        return items[_item];
    }

    /**
    @notice depositToRent allows owner of NFT to list his nft to the marketplace
    @param _nft address of ERC721
    @param _tokenId ERC721's tokenID
    @param _price desire price for the full period
    @param _collateral desire collateral for the NFT
    @param _benefits list of the benifits the listed NFT grant
    */
    function listNFT(
        address _nft,
        uint256 _tokenId,
        uint256 _price,
        uint256 _collateral,
        string calldata _benefits
    ) external {
        if (IERC721(_nft).ownerOf(_tokenId) != msg.sender) {
            revert NotOwner();
        }
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);

        // add new item to the marketpalce
        NFTData memory item = NFTData(
            msg.sender,
            _tokenId,
            _nft,
            _collateral,
            _price,
            false,
            _benefits,
            address(0)
        );

        nftsListedByOwner[msg.sender].push(nextItemId);
        items[nextItemId] = item;
        activeItem[nextItemId] = true;
        nftListed[_nft][_tokenId] = true;

        unchecked {
            nextItemId++;
        }

        emit NFTListed(
            msg.sender,
            nextItemId - 1,
            IERC721Metadata(_nft).tokenURI(_tokenId),
            _benefits,
            _benefits,
            _benefits,
            _collateral,
            _price
        );
    }

    /**
    @notice unlistNFT allows owner to unlist not rented NFTs
    @param _itemId ID of the listed NFT
    */
    function unlistNFT(uint256 _itemId) external onlyAuthorized(_itemId) {
        if (items[_itemId].rented) {
            revert AlreadyRented();
        }

        if (items[_itemId].owner == msg.sender) {
            IERC721(items[_itemId].nftAddress).transferFrom(
                address(this),
                msg.sender,
                items[_itemId].tokenId
            );
        }

        delete items[_itemId];
        uint256 jj;
        for (uint256 ii = 0; ii < nftsListedByOwner[msg.sender].length; ii++) {
            if (nftsListedByOwner[msg.sender][ii] == _itemId) {
                delete nftsListedByOwner[msg.sender][ii];
                jj = ii;
            }
            if (ii > jj) {
                nftsListedByOwner[msg.sender][
                    jj + (1 - (ii - jj))
                ] = nftsListedByOwner[msg.sender][ii];
            }
        }
        nftsListedByOwner[msg.sender].pop();

        activeItem[_itemId] = false;
        nftListed[items[_itemId].nftAddress][items[_itemId].tokenId] = false;

        emit NFTUnlisted(msg.sender, _itemId);
    }

    /**
    @notice modifyListedNFT changes the listed NFT data
    @param _itemId ID of listed NFT
    @param _collateral new value of collateral for the listed NFT
    @param _price new value of renting price for the listed NFT
    */
    function modifyListedNFT(
        uint256 _itemId,
        uint256 _collateral,
        uint256 _price
    ) external {
        require(activeItem[_itemId] == true, "not active");
        require(items[_itemId].owner == msg.sender, "not owner");
        if (items[_itemId].rented) {
            revert AlreadyRented();
        }

        items[_itemId].collateral = _collateral;
        items[_itemId].pricePerDay = _price;

        emit ListedNFTDataModified(_itemId, _collateral, _price);
    }

    /**
    @notice updateNFTRentedToReturn sets the rented field of listed NFT to false
    @param _itemId ID of the listed NFT
    */
    function returnNFT(uint256 _itemId, address _borrower) external {
        if (items[_itemId].agreementAddress != msg.sender) {
            revert AccessDenied();
        }

        items[_itemId].rented = false;
        items[_itemId].agreementAddress = address(0);

        uint256 jj;
        for (uint256 ii = 0; ii < borrowersNfts[_borrower].length; ii++) {
            if (borrowersNfts[_borrower][ii] == _itemId) {
                delete borrowersNfts[_borrower][ii];
                jj = ii;
            }
            if (ii > jj) {
                borrowersNfts[_borrower][jj + (1 - (ii - jj))] = borrowersNfts[
                    _borrower
                ][ii];
            }
        }
        borrowersNfts[_borrower].pop();

        emit NFTReturned(_itemId, block.timestamp);
    }

    /** 
    @notice tenant rent the NFT list on the platform
    @param _itemId id of the listed NFT
    @param _daysToRent number of days to rent NFT
    */
    function rent(uint256 _itemId, uint256 _daysToRent)
        external
        payable
        returns (address)
    {
        require(activeItem[_itemId] == true, "not active");
        NFTData memory item = items[_itemId];

        if (item.rented) {
            revert AlreadyRented();
        }
        if (msg.sender == item.owner) {
            revert AccessDenied();
        }
        if (msg.value < item.collateral) {
            revert LowAmount();
        }

        Agreement agreement = new Agreement(
            address(this),
            item.owner,
            msg.sender,
            msg.value,
            _daysToRent,
            item.tokenId,
            item.nftAddress,
            item.pricePerDay
        );

        payable(address(agreement)).transfer(msg.value);
        item.agreementAddress = address(agreement);
        item.rented = true;
        borrowersNfts[msg.sender].push(_itemId);

        // transfer NFT to tenant

        IERC721(items[_itemId].nftAddress).transferFrom(
            address(this),
            msg.sender,
            items[_itemId].tokenId
        );

        emit NFTRented(
            item.owner,
            msg.sender,
            address(agreement),
            items[_itemId].nftAddress,
            _itemId
        );
        return address(agreement);
    }

    receive() external payable {}

    modifier onlyAuthorized(uint256 _itemId) {
        if (
            items[_itemId].owner != msg.sender &&
            items[_itemId].agreementAddress != msg.sender
        ) {
            revert AccessDenied();
        }

        _;
    }

    fallback() external payable {}
}
