pragma solidity >=0.4.21 <0.6.0;

contract Manager{
    // TODO add Block timestamp to entry

    // basic entry of hash table
    // has a name for UX, hash to store and owner that can do some managing, TIME!!!
    struct Entry{
        string name;
        uint256 hash;
        address owner;
		uint256 time;
    }

    // manager of the entire contract system
    address public manager;

    // main hash table
    mapping (bytes32 => Entry) private hashTable;

    // constructor for the main contract
    constructor () public {
        // keep track of the main manager
        manager = msg.sender;
    }

    // helper for checking if two entries are equal
    function entryEqual(Entry memory a, Entry memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a.name, a.hash, a.owner)) == keccak256(abi.encodePacked(b.name, b.hash, b.owner));
    }

    // add an entry to the hashTable
    function addHash(string memory name, uint256 h) public {
        // require the entry to be empty
        require(entryEqual(hashTable[keccak256(abi.encodePacked(msg.sender, name))], Entry("", 0, address(0), 0)), "name already taken");

        // add the entry under the owner and name hash
        hashTable[keccak256(abi.encodePacked(msg.sender, name))] = Entry(name, h, msg.sender, block.timestamp);
    }

    // retrieve an entry from the hash Table
    function getHash(string memory name) public view returns (uint256, uint256) {
        // make sure the entry exists
        require(!entryEqual(hashTable[keccak256(abi.encodePacked(msg.sender, name))], Entry("", 0, address(0), 0)),
                 "this entry does not have a hash associated with it");

        // return the hash and the time, no need for name of msg.sender because it is called with them
        return (hashTable[keccak256(abi.encodePacked(msg.sender, name))].hash, hashTable[keccak256(abi.encodePacked(msg.sender, name))].time);
    }

	// delete an entry
    function deleteHash(string memory name) public {
        // make sure the entry exists		
		require(!entryEqual(hashTable[keccak256(abi.encodePacked(msg.sender, name))], Entry("", 0, address(0), 0)),
                 "this entry does not have a hash associated with it");

		// delete the entry from storage
		delete hashTable[keccak256(abi.encodePacked(msg.sender, name))];
    }

}
