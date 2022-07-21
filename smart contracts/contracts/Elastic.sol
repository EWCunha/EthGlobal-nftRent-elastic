// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./Agreement.sol";

contract Elastic {
    struct NFTData {
        address owner;
        uint256 tokenId;
        address nftAddress;
        uint256 collateral;
        uint256 price;
        bool rented;
        string benefits;
    }

    struct RentedNFT {
        address agreementAddress;
        address borrower;
        uint256 rentTime;
        uint256 startTime;
    }

    uint256 public nextItemId = 1; // 0 is reserved for items no longer listed

    mapping(address => uint256[]) public nftsListedByOwner;
    mapping(address => uint256[]) public borrowersNfts;
    mapping(uint256 => bool) public activeItem;
    mapping(address => mapping(uint256 => uint256)) public nftListedToItemId; // itemId = 0 means that the NFT is no longer listed
    mapping(uint256 => NFTData) public items;
    mapping(uint256 => RentedNFT) public rentedItems;

    error AccessDenied(uint256 itemId, address caller);
    error NotOwner(address caller);
    error AlreadyRented();
    error InvalidId();
    error LowAmount(uint256 itemId, uint256 rightAmount, uint256 wrongAmount);
    error NotActive();
    error NFTAlreadyListed(address caller, address nftAddress, uint256 tokenId);

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
        uint256 indexed itemId,
        address agreementAddress,
        address nftAddress,
        uint256 rentTime,
        uint256 startTime
    );
    event ListedNFTDataModified(
        address indexed owner,
        uint256 indexed itemId,
        uint256 collateral,
        uint256 price
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

    /**
    @notice getItemListByOwner returns the list of item owner by the msg.sender
    @param _owner , address to check 
    */
    function getItemListByOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        return nftsListedByOwner[_owner];
    }

    /**
    @notice getDataItem returns the data of the listed NFT
    @param _itemId ID of the listed NFT
    */
    function getDataItem(uint256 _itemId) public view returns (NFTData memory) {
        return items[_itemId];
    }

    /**
    @notice listNFT allows owner of NFT to list his nft to the marketplace
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
            revert NotOwner(msg.sender);
        }
        if (nftListedToItemId[_nft][_tokenId] > 0) {
            revert NFTAlreadyListed(msg.sender, _nft, _tokenId);
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
            _benefits
        );

        nftsListedByOwner[msg.sender].push(nextItemId);
        items[nextItemId] = item;
        activeItem[nextItemId] = true;
        nftListedToItemId[_nft][_tokenId] = nextItemId;

        unchecked {
            nextItemId++;
        }

        emit NFTListed(
            msg.sender,
            nextItemId - 1,
            IERC721Metadata(_nft).tokenURI(_tokenId),
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
    function unlistNFT(uint256 _itemId) external {
        if (items[_itemId].owner != msg.sender) {
            revert AccessDenied(_itemId, msg.sender);
        }
        if (items[_itemId].rented) {
            revert AlreadyRented();
        }

        IERC721(items[_itemId].nftAddress).transferFrom(
            address(this),
            msg.sender,
            items[_itemId].tokenId
        );

        uint256 jj;
        for (uint256 ii = 0; ii < nftsListedByOwner[msg.sender].length; ii++) {
            if (nftsListedByOwner[msg.sender][ii] == _itemId) {
                delete nftsListedByOwner[msg.sender][ii];
                jj = ii;
            }
            if (ii > jj) {
                nftsListedByOwner[msg.sender][ii - 1] = nftsListedByOwner[
                    msg.sender
                ][ii];
            }
        }
        nftsListedByOwner[msg.sender].pop();

        activeItem[_itemId] = false;
        delete nftListedToItemId[items[_itemId].nftAddress][
            items[_itemId].tokenId
        ];
        // delete items[_itemId]; // should be deleted though?

        emit NFTUnlisted(items[_itemId].owner, _itemId);
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
        if (activeItem[_itemId] == false) {
            revert NotActive();
        }
        if (items[_itemId].owner != msg.sender) {
            revert NotOwner(msg.sender);
        }
        if (items[_itemId].rented) {
            revert AlreadyRented();
        }

        items[_itemId].collateral = _collateral;
        items[_itemId].price = _price;

        emit ListedNFTDataModified(msg.sender, _itemId, _collateral, _price);
    }

    /** 
    @notice rent tenant rent the NFT list on the platform
    @param _itemId ID of the listed NFT
    @param _rentTime renting time in seconds
    */
    function rent(uint256 _itemId, uint256 _rentTime)
        external
        payable
        returns (address)
    {
        if (activeItem[_itemId] == false) {
            revert NotActive();
        }
        NFTData storage item = items[_itemId];

        if (item.rented) {
            revert AlreadyRented();
        }
        if (msg.sender == item.owner) {
            revert AccessDenied(_itemId, msg.sender);
        }
        if (msg.value < item.collateral) {
            revert LowAmount(_itemId, item.collateral, msg.value);
        }

        Agreement agreement = new Agreement(
            address(this),
            item.owner,
            msg.sender,
            item.collateral,
            _rentTime,
            item.tokenId,
            item.nftAddress,
            item.price,
            block.timestamp,
            _itemId
        );

        // transfer NFT to tenant
        IERC721(items[_itemId].nftAddress).transferFrom(
            address(this),
            msg.sender,
            items[_itemId].tokenId
        );
        payable(address(agreement)).transfer(msg.value);

        item.rented = true;
        borrowersNfts[msg.sender].push(_itemId);
        rentedItems[_itemId] = RentedNFT(
            address(agreement),
            msg.sender,
            _rentTime,
            block.timestamp
        );

        emit NFTRented(
            item.owner,
            msg.sender,
            _itemId,
            address(agreement),
            items[_itemId].nftAddress,
            _rentTime,
            block.timestamp
        );
        return address(agreement);
    }

    /**
    @notice returnNFT sets the rented field of listed NFT to false
    @param _itemId ID of the listed NFT
    @param _CID CID of the receipts stored on IPFS
    */
    function returnNFT(uint256 _itemId, string calldata _CID) public {
        if (rentedItems[_itemId].agreementAddress != msg.sender) {
            revert AccessDenied(_itemId, msg.sender);
        }

        items[_itemId].rented = false;
        address borrower = rentedItems[_itemId].borrower;
        address agreement = rentedItems[_itemId].agreementAddress;

        uint256 jj;
        for (uint256 ii = 0; ii < borrowersNfts[borrower].length; ii++) {
            if (borrowersNfts[borrower][ii] == _itemId) {
                delete borrowersNfts[borrower][ii];
                jj = ii;
            }
            if (ii > jj) {
                borrowersNfts[borrower][ii - 1] = borrowersNfts[borrower][ii];
            }
        }
        borrowersNfts[borrower].pop();
        delete rentedItems[_itemId];

        emit NFTReturned(
            items[_itemId].owner,
            borrower,
            _itemId,
            agreement,
            _CID
        );
    }

    /**
    @notice removeNFT removes the rented NFT when the borrower does not return it
    @param _itemId ID of the listed NFT
    @param _CID CID of the receipts stored on IPFS
    */
    function removeNFT(uint256 _itemId, string calldata _CID) external {
        if (rentedItems[_itemId].agreementAddress != msg.sender) {
            revert AccessDenied(_itemId, msg.sender);
        }

        address owner = items[_itemId].owner;
        address borrower = rentedItems[_itemId].borrower;
        address agreement = rentedItems[_itemId].agreementAddress;

        // Deleting renting info
        uint256 jj;
        for (uint256 ii = 0; ii < borrowersNfts[borrower].length; ii++) {
            if (borrowersNfts[borrower][ii] == _itemId) {
                delete borrowersNfts[borrower][ii];
                jj = ii;
            }
            if (ii > jj) {
                borrowersNfts[borrower][ii - 1] = borrowersNfts[borrower][ii];
            }
        }
        borrowersNfts[borrower].pop();
        delete rentedItems[_itemId];

        // Unlisting
        jj = 0;
        for (uint256 ii = 0; ii < nftsListedByOwner[owner].length; ii++) {
            if (nftsListedByOwner[owner][ii] == _itemId) {
                delete nftsListedByOwner[owner][ii];
                jj = ii;
            }
            if (ii > jj) {
                nftsListedByOwner[owner][ii - 1] = nftsListedByOwner[owner][ii];
            }
        }
        nftsListedByOwner[owner].pop();

        activeItem[_itemId] = false;
        delete nftListedToItemId[items[_itemId].nftAddress][
            items[_itemId].tokenId
        ];

        emit NFTRemoved(owner, borrower, _itemId, agreement, _CID);
    }

    fallback() external payable {}

    receive() external payable {}
}
