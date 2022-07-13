// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAgreement.sol";
import "./Agreement.sol";

contract Elastic is Ownable {
    enum ProposalStatus {
        PROPOSED,
        ACCEPTED,
        DECLINED,
        ONGOING,
        FINISHED
    }

    struct NFTData {
        address owner;
        uint256 tokenId;
        address nftAddress;
        uint256 collateral;
        uint256 pricePerDay;
        bool automaticApproval;
        bool rented;
        bytes32 benefits;
        uint256[] proposalIds;
    }

    struct Proposal {
        address tenant;
        uint256 itemId;
        ProposalStatus status;
        uint256 daysToRent;
        address agreementAddress;
    }

    uint256 public nextItemId = 1;
    uint256 public nextProposalId = 1;

    mapping(uint256 => NFTData) public items;
    mapping(uint256 => Proposal) public proposals;

    error AccessDenied();
    error NotOwner();
    error AlreadyRented();
    error InvalidId();
    error NotAcceptedProposal();
    error LowAmount();

    event NFTListed(
        address indexed owner,
        uint256 indexed itemId,
        bytes32 indexed benefits,
        uint256 collateral,
        uint256 price
    );
    event NFTUnlisted(address indexed owner, uint256 indexed itemId);
    event NFTRented(
        address indexed owner,
        address indexed tenant,
        address indexed agreement,
        address itemAddress,
        uint256 itemId,
        uint256 proposalId
    );
    event NewProposal(
        address indexed tenant,
        uint256 indexed itemId,
        uint256 indexed proposalId
    );
    event ChangedProposalStatus(
        uint256 indexed proposalId,
        ProposalStatus status
    );

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
        bytes32 _benefits
    ) external {
        if (IERC721(_nft).ownerOf(_tokenId) != msg.sender) {
            revert NotOwner();
        }
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);

        // add new item to the marketpalce
        NFTData memory item;
        item.owner = msg.sender;
        item.tokenId = _tokenId;
        item.nftAddress = _nft;
        item.collateral = _collateral;
        item.pricePerDay = _price;
        item.automaticApproval = true; // for now, should be false
        item.rented = false;
        item.benefits = _benefits;

        items[nextItemId] = item;

        unchecked {
            nextItemId++;
        }

        emit NFTListed(
            msg.sender,
            nextItemId--,
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
            revert AccessDenied();
        }
        if (items[_itemId].rented) {
            revert AlreadyRented();
        }

        IERC721(items[_itemId].nftAddress).transferFrom(
            address(this),
            msg.sender,
            items[_itemId].tokenId
        );

        delete items[_itemId];

        emit NFTUnlisted(msg.sender, _itemId);
    }

    /**
    @notice newProposal allows borrower to propose a new renting agreement
    @param _itemId ID of the NFT to be rented
    @param _daysToRent number of days to rent the NFT
    */
    function newProposal(uint256 _itemId, uint256 _daysToRent) external {
        if (_itemId == 0 || _itemId >= nextItemId) {
            revert InvalidId();
        }
        if (msg.sender == items[_itemId].owner) {
            revert AccessDenied();
        }

        Proposal memory proposal = Proposal(
            msg.sender,
            _itemId,
            items[_itemId].automaticApproval
                ? ProposalStatus.ACCEPTED
                : ProposalStatus.PROPOSED,
            _daysToRent,
            address(0)
        );

        proposals[nextProposalId] = proposal;
        items[_itemId].proposalIds.push(nextProposalId);

        unchecked {
            nextProposalId++;
        }

        emit NewProposal(msg.sender, _itemId, nextProposalId--);
    }

    /**
    @notice changeProposalStatus changes the status of a existing proposal
    @param _proposalId ID of the proposal which status must be changed
    @param _status status to which the proposal must be changed
    */
    function changeProposalStatus(uint256 _proposalId, ProposalStatus _status)
        public
    {
        uint256 itemId = proposals[_proposalId].itemId;
        address agreementContract = proposals[_proposalId].agreementAddress;

        if (
            msg.sender != items[itemId].owner &&
            msg.sender != address(this) &&
            msg.sender != agreementContract
        ) {
            revert AccessDenied();
        }
        if (_proposalId == 0 || _proposalId >= nextProposalId) {
            revert InvalidId();
        }

        Proposal storage proposal = proposals[_proposalId];
        proposal.status = _status;

        emit ChangedProposalStatus(_proposalId, _status);
    }

    /** 
    @notice tenant rent the NFT list on the platform
    @param _proposalId id of the rent proposal
    */
    function rent(uint256 _proposalId) external payable {
        uint256 itemId = proposals[_proposalId].itemId;
        address proposalCreator = proposals[_proposalId].tenant;
        NFTData storage item = items[itemId];

        if (item.rented) {
            revert AlreadyRented();
        }
        if (proposals[_proposalId].status != ProposalStatus.ACCEPTED) {
            revert NotAcceptedProposal();
        }
        if (msg.sender != proposalCreator) {
            revert AccessDenied();
        }
        if (msg.value >= item.collateral) {
            revert LowAmount();
        }

        Proposal storage proposal = proposals[_proposalId];

        Agreement agreement = new Agreement(
            address(this),
            item.owner,
            msg.sender,
            msg.value,
            proposal.daysToRent,
            item.tokenId,
            item.nftAddress,
            _proposalId,
            item.pricePerDay
        );

        payable(address(agreement)).transfer(msg.value);
        proposal.agreementAddress = address(agreement);
        proposal.status = ProposalStatus.ONGOING;
        item.rented = true;

        // transfer NFT to tenant
        address _nft = items[itemId].nftAddress;
        IERC721(_nft).transferFrom(address(this), msg.sender, item.tokenId);

        emit NFTRented(
            item.owner,
            msg.sender,
            address(agreement),
            _nft,
            itemId,
            _proposalId
        );
    }
}
