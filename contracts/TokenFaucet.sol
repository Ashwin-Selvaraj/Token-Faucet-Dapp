// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/AshToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFaucet is Ownable {
    IERC20 public _token;
    // The amount of token to drip
    uint256 private _amount;
    // mapping to show whether the person is eligible for next drip
    mapping(address => uint) public lastDripTime;
    uint private constant _dripInterval = 5 minutes;

    constructor(IERC20 tokenAddress, uint256 amount) public {
        _token = tokenAddress;
        _amount = amount;
        Ownable.transferOwnership(msg.sender);
    }

    modifier tokenSet() {
        require(address(_token) != address(0), "Token Address not set");
        _;
    }
    modifier amountSet() {
        require(_amount > 0, "Amount not set");
        _;
    }

    modifier canDrip(address recipient) {
        require(
            lastDripTime[recipient] + _dripInterval <= block.timestamp,
            "Recipient has to wait for 5 minutes"
        );
        _;
    }

    function setAmount(uint amount) public onlyOwner {
        _amount = amount;
    }

    function getBalance() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    function drip() public tokenSet amountSet canDrip(msg.sender) {
        require(msg.sender != address(0), "not a valid acccount");
        require(
            _token.balanceOf(address(this)) > _amount,
            "Insufficient balance"
        );
        _token.transfer(msg.sender, _amount);
        lastDripTime[msg.sender] = block.timestamp;
    }

    function getLastDripTime(address recipient) public view returns (uint) {
        return lastDripTime[recipient];
    }

    function dripCheck(address recipient) public view returns (bool) {
        if (lastDripTime[recipient] + _dripInterval <= block.timestamp) {
            return true;
        } else {
            return false;
        }
    }

    function withdrawl() external onlyOwner {
        _token.transfer(msg.sender, _token.balanceOf(address(this)));
    }
}
