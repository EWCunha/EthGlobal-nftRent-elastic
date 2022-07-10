// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/IAgreement.sol";

contract Agreement is ERC721, IAgreement {
    address public elasticAddress;
    uint256 internal nextId;

    bool internal initialized;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function init(address _Elastic) external {
        require(!initialized, "already initialized");
        require(_Elastic != address(0), "invalid address");
        elasticAddress = _Elastic;
        initialized = true;
    }

    function agreementData(uint256 agreementId)
        external
        view
        override
        returns (IAgreement.AgreementData memory)
    {}

    function mint(
        address _tenant,
        address _lessor,
        address _nft,
        uint256 _burnableAt,
        uint256 _amount
    ) external override onlyElastic returns (uint256) {}

    function agreementByAddress(address _part)
        external
        view
        returns (uint256[] memory)
    {}

    function burn(uint256 _agreementId) external override onlyElastic {}

    modifier onlyElastic() virtual {
        require(elasticAddress == msg.sender, "access denied");
        _;
    }
}
