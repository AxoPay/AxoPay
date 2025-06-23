pragma solidity ^0.8.0;

pragma solidity ^0.8.26;

contract Transactions {
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function deposit(uint256 _amount) public payable {
        require(_amount > 0, "Invalid deposit amount");
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Failed to send Ether");
    }

    function notPayable() public {}

    function withdraw(uint256 _amount) public {
        (bool success,) = owner.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    function transfer(address payable _to, uint256 _amount) public {
        (bool success,) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}