// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transacciones {

    event Deposit(address indexed from, uint256 amount);

    event Transfer(address indexed from, address indexed to, uint256 amount);

    event Withdrawal(address indexed to, uint256 amount);

    mapping(address => uint256) public balances;

    function deposit() external payable {
        require(msg.value > 0, "Debes enviar algo de ETH.");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function transferTo(address payable _to, uint256 _amount) external {
        require(_to != address(0), "Direccion invalida.");
        require(address(this).balance > _amount, "Fondos insuficientes en el contrato.");

        _to.transfer(_amount);
        emit Transfer(msg.sender, _to, _amount);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
