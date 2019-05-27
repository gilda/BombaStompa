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
        let address = await manager.manager();
        
        assert.equal(address, accounts[0]);
    });

    it("Should store hash and retrieve the same", async () => {
        // constants for testing
        let hash = web3.utils.keccak256("file");
        let name = "gilda";

        // send and retrieve hash
        await manager.addHash(name, hash);
        let hashTest = await manager.getHash(name);
        
        assert.equal(hash, '0x' + hashTest.toString(16));
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

});
