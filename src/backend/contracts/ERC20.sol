// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner, address indexed spender, uint256 value
    );

    uint256 private _totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals;
    address public owner;

    mapping(address => uint256) private _balanceOf;
    mapping(address => mapping(address => uint256)) private _allowance;

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede hacer esto");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender;
    }

    function transfer(address recipient, uint256 amount)
        external
        returns (bool)
    {
        require(recipient != address(0), "No puedes transferir a esta direccion");
        require(_balanceOf[msg.sender] >= amount, "Fondos insuficientes");
        _balanceOf[msg.sender] -= amount;
        _balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "No puedes aprobar esta direccion");

        _allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount)
        external
        returns (bool)
    {
        require(recipient != address(0), "Destino invalido");
        require(_balanceOf[sender] >= amount, "Fondos insuficientes en origen");
        require(_allowance[sender][msg.sender] >= amount, "No tienes permiso para hacer esto");

        _allowance[sender][msg.sender] -= amount;
        _balanceOf[sender] -= amount;
        _balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function _mint(address to, uint256 amount) internal onlyOwner(){
        _balanceOf[to] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal onlyOwner(){
        _balanceOf[from] -= amount;
        _totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    function mint(address to, uint256 amount) external onlyOwner(){
        require(to != address(0), "No puedes mintear a esta direccion");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner(){
        require(from != address(0), "Direccion invalida");
        require(_balanceOf[from] >= amount, "No hay suficientes tokens");
        _burn(from, amount);
    }
}
