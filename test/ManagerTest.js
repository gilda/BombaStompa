const Manager = artifacts.require('./Manager.sol')

contract("Manager Hash Table", async accounts => {
    
    it("Should assign manager address at constructor", async () => {
        let manager = await Manager.deployed();
        let address = await manager.manager();
        assert.equal(address, accounts[0]);
    });

    
})
