const Manager = artifacts.require('./Manager.sol')
const truffleAssert = require('truffle-assertions');

// tests for the manager contract
contract("Manager Hash Table", async accounts => {

	// reset contract before each test
	beforeEach(async () => {
		manager = await Manager.new()
	});
	
	it("Should assign manager address at constructor", async () => {        
		// get manager
		let address = await manager.owner();
		
		// make sure the contract returns the same address
		assert.equal(address, accounts[0]);
	});

	it("Should store hash and retrieve the same", async () => {
		// constants for testing
		let hash = web3.utils.keccak256("file");
		let name = "gilda";

		// send and retrieve hash
		await manager.addHash(name, hash);
		let hashTest = await manager.getHash(name);

		// make sure the hash retrieved is the same one that was sent
		assert.equal(hash, '0x' + hashTest[0].toString(16));
	});

	// error if entry already exists
	it("Should throw if entry already exists", async () => {
		// constants for testing
		let hash = web3.utils.keccak256("file");
		let hash1 = web3.utils.keccak256("file1");
		let name = "gilda";

		// send first hash
		await manager.addHash(name, hash);

		// send second hash (should throw)
		await truffleAssert.reverts(manager.addHash(name, hash1));
	});

	// cant retrieve an empty entry
	it("Should not retrieve empty entry", async () => {
		// test require entry not to be empty
		let name = "name";

		// getting an empty entry should throw
		await truffleAssert.reverts(manager.getHash(name));
	});

	// cant delete an empty entry (though it is already deleted/empty)
	it("Should not delete empty entry", async () => {
		// test require entry not to be empty
		let name = "name";

		// getting an empty entry should throw
		await truffleAssert.reverts(manager.getHash(name));
	});

	// delete works properly
	it("Should delete an entry", async () => {
		let hash = web3.utils.keccak256("file");
		let name = "gilda";

		// send first hash
		await manager.addHash(name, hash);

		// delete the hash
		await manager.deleteHash(name);
		
		// assert that that hash no longer exists
		await truffleAssert.reverts(manager.getHash(name));
	});

	// block timestamps are rising and are not 0
	// WARNING MAY FAIL IF NETWORK IS UNDER ATTACK OR TO VARIOUS TIMING ATTACKS/SHENANIGANS!!!
	it("Should store timestamp correctly and retrieve it", async () => {
		// constants for testing
		let hash = web3.utils.keccak256("file");
		let name = "gilda";

		// constants1 for testing
		let hash1 = web3.utils.keccak256("file1");
		let name1 = "gilda1";

		// send and retrieve hash
		await manager.addHash(name, hash);
		let hashTest = await manager.getHash(name);

		// send and retrieve hash1
		await manager.addHash(name1, hash1);
		let hashTest1 = await manager.getHash(name1);

		// both timestamps are not 0
		assert(hashTest[1] != 0 && hashTest1[1] != 0);
		
		// second timestamp is larger than first (or same if realy fast network)
		assert(hashTest1[1] >= hashTest[1]);
    });
    
    it("Should send donation and reteive it", async () => {
        const eth = 1000000000000000000;
        
        // send ether to contract
        await web3.eth.sendTransaction({from: accounts[1], to: manager.address, value: eth});
        
        // redeem the donation
        await manager.redeemDonations();
    });

});
