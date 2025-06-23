pragma solidity ^0.8.0;

contract Withdraw {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    function withdraw(uint256 _amount) public {
        uint256 contractBalance = getBalance();
        require(_amount <= contractBalance, "Fondos insuficientes en el contrato");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

}