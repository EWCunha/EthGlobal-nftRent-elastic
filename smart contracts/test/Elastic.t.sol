// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../contracts/Elastic.sol";
import "../contracts/Agreement.sol";
import "../contracts/Test/TESTERC721.sol";
import "../contracts/interfaces/IAgreement.sol";
import "forge-std/Test.sol";

contract ElasticTest is Test {
    address public owner = address(3);
    address public lessor = address(4);
    address public tenant = address(5);
    address public whale = 0x0000000000000000000000000000000000000001;

    Elastic elastic;
    TestERC721 nft;

    function setUp() public {
        vm.startPrank(owner);
        elastic = new Elastic();
        nft = new TestERC721("MockToken", "MT");
        vm.stopPrank();
    }

    function test_listToken() public {
        vm.prank(owner);
        nft.mint(lessor, 0);
        assertEq(nft.ownerOf(0), lessor);
        vm.prank(lessor);
        nft.approve(address(elastic), 0);
        vm.prank(lessor);
        elastic.listNFT(address(nft), 0, 2e18, 12e18, "memory");
    }

    function test_unlist() public {
        test_listToken();
        vm.startPrank(lessor);
        assertEq(elastic.getItemListByOwner(lessor).length, 1);
        assertEq(elastic.getItemListByOwner(lessor)[0], 1);
        elastic.unlistNFT(1);
        assertEq(elastic.getItemListByOwner(lessor).length, 0);
    }

    function test_listAndModify() public {
        test_listToken();
        vm.startPrank(lessor);
        elastic.modifyListedNFT(1, 10e18, 8e18);
        vm.expectRevert("not active");
        elastic.modifyListedNFT(2, 10e18, 8e18);
        assertEq(elastic.getDataItem(1).pricePerDay, 8e18);
        assertEq(elastic.getDataItem(1).collateral, 10e18);
    }

    function test_rent() public {
        test_listToken();
        vm.deal(tenant, 100000e18);
        vm.deal(address(elastic), 100000000e18);
        console2.log(address(tenant).balance);
        vm.prank(tenant);
        address agreement = elastic.rent{value: 12e18}(1, 30);
        assertEq(IAgreement(agreement).getElasticAddress(), address(elastic));
    }
}
