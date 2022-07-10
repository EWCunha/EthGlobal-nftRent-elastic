// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

/** 
Some appreciation about the way the agreement would present itself . 
idea would be to mint a ERC721 token that would represent the agreement between tenant and lessor
*/
interface IAgreement {
    struct AgreementData {
        address tenant;
        address lessor;
        address _nft;
        uint256 burnableAt;
        uint256 amount;
    }

    function agreementData(uint256 agreementId)
        external
        view
        returns (AgreementData memory);

    function agreementByAddress(address _part)
        external
        view
        returns (uint256[] memory);

    function mint(
        address tenant,
        address lessor,
        address _nft,
        uint256 burnableAt,
        uint256 amount
    ) external returns (uint256);

    function burn(uint256 agreementId) external;
}
