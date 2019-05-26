pragma solidity >=0.4.21 <0.6.0;

contract Manager{
    // TODO figure out structs and struct mapping

    address public manager;
    mapping (string => uint256) private hashTable;

    constructor () public {
        // keep track of the main manager
        manager = msg.sender;
    }

    // add an entry to the hashTable
    function addHash(string memory name, uint256 h) public {
        require(hashTable[name] == 0, "name already taken");
        hashTable[name] = h;
    }

    // retrieve an entry from the hash Table
    function getHash(string memory name) public view returns (uint256) {
        require(hashTable[name] != 0, "this entry does not have a hash associated with it");
        return hashTable[name];
    }

}
