// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AshToken is ERC20, Ownable {
    constructor(uint initialSupply) ERC20("AshToken", "ASH") {
        _mint(msg.sender, (initialSupply * 10 ** decimals()));
        Ownable.transferOwnership(msg.sender);
    }

    function mint(
        address account,
        uint256 amount
    ) public onlyOwner returns (bool) {
        require(
            (account != address(this)) && amount != uint256(0),
            "Invalid ERC20 inputs:address,amount"
        );
        _mint(account, (amount * 10 ** decimals()));
        return true;
    }

    function burn(
        address account,
        uint256 amount
    ) public onlyOwner returns (bool) {
        require(
            (account != address(this)) && amount != uint256(0),
            "Invalid ERC20 inputs:address,amount"
        );
        _burn(account, (amount * 10 ** decimals()));
        return true;
    }

    function buy() public payable returns (bool) {
        require(
            _msgSender().balance >= msg.value && msg.value != 0 ether,
            "ICO: function buy invalid input"
        );
        uint amount = (msg.value * 1000) / 1000000000000000000;
        _transfer(owner(), _msgSender(), amount);
        return true;
    }

    function withdraw(uint amount) public onlyOwner returns (bool) {
        require(
            amount <= address(this).balance,
            "ICO: function withdraw has invalid input"
        );
        (bool success, ) = msg.sender.call{value: (amount * 10 ** decimals())}(
            ""
        );
        return success;
    }

    function transfer(
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        address _owner = msg.sender;
        _transfer(_owner, to, (value * 10 ** decimals()));
        return true;
    }
}
