pragma solidity ^0.8.0;

pragma solidity ^0.8.26;

contract Transactions {
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function deposit() public payable {}

    function notPayable() public {}

    function withdraw() public {
        uint256 amount = address(this).balance;

        (bool success,) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    function transfer(address payable _to, uint256 _amount) public {
        (bool success,) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}