// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAgreement.sol";

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
        uint256 collateral;
        uint256 ratePerDay;
        bool automaticApproval;
        bool rented;
        bytes32[] benefits;
    }

    struct Proposal {
        address tenant;
        uint256 itemId;
        ProposalStatus status;
        uint256 daysToRend;
        address agreementAddress;
    }

    uint256 itemCount;
    uint256 proposalCount;

    NFTData[] itemList;
    Proposal[] proposalList;
    mapping(address => NFTData) nftData;
    mapping(uint256 => address) itemAddress;
    mapping(uint256 => Proposal) proposals;
    mapping(uint256 => Proposal[]) itemProposals;

    error InvalidAddress();
    error InvalidBalance();
    error executionFailed();

    event NFTListed(
        address indexed owner,
        uint256 indexed itemId,
        uint256 collateral,
        uint256 price
    );
    event NFTUnlisted(address indexed owner, uint256 indexed itemId);
    event NFTRented(address indexed tenant, address indexed item);
    event NewProposal(
        address indexed tenant,
        uint256 indexed itemId,
        uint256 indexed proposalId
    );
    event ChangedProposalStatus(
        uint256 indexed proposalId,
        ProposalStatus status
    );

    constructor() {
        itemList.push(NFTData());
        proposalList.push(Proposal());
        itemCount++;
        proposalCount++;
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
        bytes32[] calldata _benefits
    ) external {
        if (IERC721(_nft).ownerOf(_tokenId) != msg.sender) {
            revert InvalidAddress();
        }
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);

        // add new item to the marketpalce
        NFTData memory item = NFTData(
            msg.sender,
            _tokenId,
            _collateral,
            _price,
            false,
            false,
            _benefits
        );
        itemList.push(item);
        itemAddress[itemCount] = _nft;
        unchecked {
            itemCount++;
        }
        emit NFTListed(msg.sender, itemCount--, _collateral, _price);
    }

    /**
    @notice unlistNFT allows owner to unlist not rented NFTs
    @param _itemId ID of the listed NFT
    */
    function unlistNFT(uint256 _itemId) external {
        require(
            itemList[_itemId].owner == msg.sender,
            "Only owner can unlist NFT"
        );
        require(
            !itemList[_itemId].rented,
            "Only not rented NFT can be unlisted"
        );

        uint256 tokenId = itemList[_itemId].tokenId;
        address _itemAddress = itemAddress[_itemId];

        IERC721(_nft).transferFrom(address(this), msg.sender, tokenId);

        delete itemList[_itemId];
        delete nftData[_itemAddress];
        delete itemProposals[_itemId];

        emit NFTUnlisted(msg.sender, _itemId);
    }

    /**
    @notice newProposal allows borrower to propose a new renting agreement
    @param _itemId ID of the NFT to be rented
    @param _daysToRent number of days to rent the NFT
    */
    function newProposal(uint256 _itemId, uint256 _daysToRent) external {
        require(_itemId < itemCount && _itemId > 0, "NFT not listed");

        Proposal memory proposal = Proposal(
            msg.sender,
            _itemId,
            itemList[_itemId].automaticApproval
                ? ProposalStatus.ACCEPTED
                : ProposalStatus.PROPOSED,
            _daysToRent,
            address(0)
        );

        proposalList.push(proposal);
        proposals[proposalCount] = proposal;
        itemProposals[_itemId].push(proposal);
        unchecked {
            proposalCount++;
        }

        emit NewProposal(msg.sender, _itemId, proposalCount--);
    }

    /**
    @notice changeProposalStatus changes the status of a existing proposal
    @param _proposalId ID of the proposal which status must be changed
    @param _status status to which the proposal must be changed
    */
    function changeProposalStatus(uint256 _proposalId, ProposalStatus _status)
        public
    {
        uint256 itemId = proposalList[_proposalId].itemId;
        require(
            itemList[itemId].owner == msg.sender || address(this) == msg.sender,
            "Not allowed to change proposal status"
        );
        require(
            _proposalId < proposalCount && _proposalId > 0,
            "Proposal does not exist"
        );

        Proposal storage proposal = proposalList[_proposalId];
        proposal.status = _status;

        emit ChangedProposalStatus(_proposalId, _status);
    }

    /** 
    @notice tenant rent the NFT list on the platform
    @param _proposalId id of the rent proposal
    */
    function rent(uint256 _proposalId) external payable {
        uint256 itemId = proposalList[_proposalId].itemId;
        NFTData memory item = itemList[itemId];
        require(!item.rented, "Cannot rent already rented NFT");
        // todo , create agreement contract and deploy it , with the data
        // todo , transfer collateral to the new agreeement contract
        // todo , input new agreeement contract address in the proposal struct
        // transfer NFT to tenant
        address _nft = itemAddress[_itemId];
        IERC721(_nft).transferFrom(address(this), msg.sender, item.tokenId);

        emit NFTRented(msg.sender, _nft);
    }
}
