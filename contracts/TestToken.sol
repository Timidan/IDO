pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IDT2 is ERC20 {
  constructor() ERC20("IDT2", "IDT2") {
    _mint(msg.sender, 10000000e18); //10000000 tokens totalsupply
  }
}
