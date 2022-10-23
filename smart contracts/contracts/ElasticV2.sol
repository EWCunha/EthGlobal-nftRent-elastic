// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./Agreement.sol";
import "./interfaces/IElastic.sol";

contract ElasticV2 is IElastic {
    mapping(uint256 => NFTData) public itemIdToNft;
    mapping(uint256 => RentedNFT) public itemIdToRentedNft;
    mapping(address => uint256[]) public ownerToItemIds;
    mapping(uint256 => uint256) public itemIdToIndex;
    mapping(address => mapping(address => mapping(uint256 => uint256)))
        public ownerToNftItemId;

    uint256 public nextItemId = 1; // 0 is reserved for items no longer listed

    /**
    @notice listNft allows owner of NFT to list his nft to the marketplace
    @param _nftAddress address of ERC721
    @param _tokenId ERC721's tokenID
    @param _price desire price for the full period
    @param _collateral desire collateral for the NFT
    @param _benefits list of the benifits the listed NFT grant
    */
    function listNft(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price,
        uint256 _collateral,
        string calldata _benefits
    ) external override {
        if (IERC721(_nftAddress).ownerOf(_tokenId) != msg.sender) {
            revert NotOwner(msg.sender);
        }

        uint256 _itemId = ownerToNftItemId[msg.sender][_nftAddress][_tokenId];
        if (_itemId != 0) {
            revert NFTAlreadyListedByOwner(
                msg.sender,
                _nftAddress,
                _tokenId,
                _itemId
            );
        }

        uint256 _nextItemId = nextItemId;

        itemIdToNft[_nextItemId] = NFTData(
            _nftAddress,
            _tokenId,
            _collateral,
            _price,
            msg.sender,
            false,
            _benefits
        );

        uint256 itemIdIndex = ownerToItemIds[msg.sender].length;
        itemIdToIndex[_nextItemId] = itemIdIndex;
        ownerToItemIds[msg.sender].push(_nextItemId);

        unchecked {
            nextItemId = _nextItemId + 1;
        }

        IERC721(_nftAddress).transferFrom(msg.sender, address(this), _tokenId);

        emit NFTListed(
            msg.sender,
            _nextItemId,
            IERC721Metadata(_nftAddress).tokenURI(_tokenId),
            _benefits,
            _benefits,
            _nftAddress,
            _tokenId
        );
    }

    /**
    @notice unlistNft allows owner to unlist not rented NFTs
    @param _itemId ID of the listed NFT
    */
    function unlistNft(uint256 _itemId) external override {
        _validItemId(_itemId);

        NFTData memory item = itemIdToNft[_itemId];

        _checkIfActive(item.nftAddress, _itemId);
        _checkAccess(item.owner, msg.sender, _itemId, false);
        _checkIfRented(item.rented, _itemId);

        _unlistNft(item, _itemId);

        IERC721(item.nftAddress).transferFrom(
            address(this),
            msg.sender,
            item.tokenId
        );

        emit NFTUnlisted(msg.sender, _itemId);
    }

    /**
    @notice modifyListedNft changes the listed NFT data
    @param _itemId ID of listed NFT
    @param _collateral new value of collateral for the listed NFT
    @param _price new value of renting price for the listed NFT
    */
    function modifyListedNft(
        uint256 _itemId,
        uint256 _collateral,
        uint256 _price
    ) external override {
        _validItemId(_itemId);

        NFTData storage item = itemIdToNft[_itemId];
        _checkIfActive(item.nftAddress, _itemId);
        _checkAccess(item.owner, msg.sender, _itemId, false);
        _checkIfRented(item.rented, _itemId);

        item.collateral = _collateral;
        item.price = _price;

        emit ListedNFTDataModified(msg.sender, _itemId, _collateral, _price);
    }

    /** 
    @notice rentNft tenant rent the NFT list on the platform
    @param _itemId ID of the listed NFT
    @param _rentTime renting time in seconds
    */
    function rentNft(uint256 _itemId, uint256 _rentTime)
        external
        payable
        override
    {
        _validItemId(_itemId);

        NFTData storage item = itemIdToNft[_itemId];
        _checkIfActive(item.nftAddress, _itemId);
        _checkAccess(item.owner, msg.sender, _itemId, true);
        _checkIfRented(item.rented, _itemId);
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

        item.rented = true;
        itemIdToRentedNft[_itemId] = RentedNFT(
            address(agreement),
            msg.sender,
            _rentTime,
            block.timestamp
        );

        // transfer NFT to tenant
        IERC721(item.nftAddress).transferFrom(
            address(this),
            msg.sender,
            item.tokenId
        );
        payable(address(agreement)).transfer(msg.value);

        emit NFTRented(
            item.owner,
            msg.sender,
            _itemId,
            address(agreement),
            item.nftAddress,
            item.tokenId,
            _rentTime,
            block.timestamp
        );
    }

    /**
    @notice returnNft sets the rented field of listed NFT to false
    @param _itemId ID of the listed NFT
    @param _CID CID of the receipts stored on IPFS
    */
    function returnNft(uint256 _itemId, string calldata _CID)
        external
        override
    {
        _validItemId(_itemId);

        NFTData storage item = itemIdToNft[_itemId];
        RentedNFT storage rentedItem = itemIdToRentedNft[_itemId];
        _checkIfActive(item.nftAddress, _itemId);
        _checkAccess(rentedItem.agreementAddress, msg.sender, _itemId, false);
        _checkIfRented(item.rented, _itemId);

        address agreement = rentedItem.agreementAddress;
        address borrower = rentedItem.borrower;

        item.rented = false;
        delete itemIdToRentedNft[_itemId];

        emit NFTReturned(item.owner, borrower, _itemId, agreement, _CID);
    }

    /**
    @notice removeNft removes the rented NFT when the borrower does not return it
    @param _itemId ID of the listed NFT
    @param _CID CID of the receipts stored on IPFS
    */
    function removeNft(uint256 _itemId, string calldata _CID)
        external
        override
    {
        _validItemId(_itemId);

        NFTData storage item = itemIdToNft[_itemId];
        RentedNFT storage rentedItem = itemIdToRentedNft[_itemId];
        _checkIfActive(item.nftAddress, _itemId);
        _checkAccess(rentedItem.agreementAddress, msg.sender, _itemId, false);
        _checkIfRented(item.rented, _itemId);

        address agreement = rentedItem.agreementAddress;
        address owner = item.owner;
        address borrower = rentedItem.borrower;

        // Deleting renting info
        item.rented = false;
        delete itemIdToRentedNft[_itemId];

        // Unlisting
        _unlistNft(item, _itemId);

        emit NFTRemoved(owner, borrower, _itemId, agreement, _CID);
    }

    // INTERNAL FUNCTIONS

    // storage processes
    function _unlistNft(NFTData memory _item, uint256 _itemId) internal {
        uint256[] storage _itemIds = ownerToItemIds[_item.owner];
        uint256 _itemIdIndex = itemIdToIndex[_itemId];
        uint256 lastIndex = _itemIds.length - 1;
        _itemIds[_itemIdIndex] = _itemIds[lastIndex];
        _itemIds.pop();

        delete ownerToNftItemId[_item.owner][_item.nftAddress][_item.tokenId];
        delete itemIdToNft[_itemId];
        delete itemIdToIndex[_itemId];
    }

    // checks and verifications
    function _validItemId(uint256 _itemId) internal view {
        if (_itemId > nextItemId || _itemId == 0) {
            revert InvalidItemId(_itemId);
        }
    }

    function _checkAccess(
        address _caller,
        address _access,
        uint256 _itemId,
        bool _equal
    ) internal pure {
        if (!_equal) {
            if (_caller != _access) {
                revert AccessDenied(_itemId, _caller);
            }
        } else {
            if (_caller == _access) {
                revert AccessDenied(_itemId, _caller);
            }
        }
    }

    function _checkIfRented(bool _isRented, uint256 _itemId) internal view {
        if (_isRented) {
            RentedNFT memory rentedNft = itemIdToRentedNft[_itemId];
            revert AlreadyRented(
                rentedNft.agreementAddress,
                rentedNft.borrower,
                rentedNft.rentTime,
                rentedNft.startTime
            );
        }
    }

    function _checkIfActive(address _nftAddress, uint256 _itemId)
        internal
        pure
    {
        if (_nftAddress == address(0)) {
            revert NotActive(_itemId);
        }
    }
}
