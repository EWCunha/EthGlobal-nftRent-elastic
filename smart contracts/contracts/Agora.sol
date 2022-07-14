// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract Agora {
    address[] public owners;
    mapping(address => uint256) public balances;
    uint256 public remainderBalance;
    address payable public destinationAddress;

    error InvalidMethod();
    error AccessDenied();

    event PaymentReceived(address indexed _from, uint256 _amount);
    event BalanceWithdrawed(address indexed _from, uint256 _amount);
    event RemainderDealt(address indexed _from, uint256 indexed _method);

    constructor(address[] memory _owners, address payable _destinationAddress) {
        for (uint256 ii = 0; ii < _owners.length; ii++) {
            owners[ii] = _owners[ii];
        }
        destinationAddress = _destinationAddress;
    }

    receive() external payable {
        uint256 remainder = msg.value % owners.length;
        uint256 sharedBalance = (msg.value - remainder) / owners.length;
        for (uint256 ii = 0; ii < owners.length; ii++) {
            balances[owners[ii]] += sharedBalance;
        }
        remainderBalance += remainder;

        emit PaymentReceived(msg.sender, msg.value);
    }

    function setDestinationAddress(address payable _newAddress)
        external
        onlyOwners
    {
        destinationAddress = _newAddress;
    }

    function dealWithRemainderBalance(uint256 _method) external onlyOwners {
        if (_method == 0) {
            uint256 remainder = remainderBalance % owners.length;
            uint256 sharedBalance = (remainderBalance - remainder) /
                owners.length;
            for (uint256 ii = 0; ii < owners.length; ii++) {
                balances[owners[ii]] += sharedBalance;
            }
        } else if (_method == 1) {
            destinationAddress.transfer(remainderBalance);
        } else {
            revert InvalidMethod();
        }

        emit RemainderDealt(msg.sender, _method);
    }

    function withdrawBalance() external {
        uint256 amount = balances[msg.sender];
        payable(msg.sender).transfer(amount);
        balances[msg.sender] = 0;

        emit BalanceWithdrawed(msg.sender, amount);
    }

    modifier onlyOwners() {
        bool found = false;
        for (uint256 ii = 0; ii < owners.length; ii++) {
            if (msg.sender == owners[ii]) {
                found = true;
                break;
            }
        }
        if (!found) {
            revert AccessDenied();
        }
        _;
    }
}
