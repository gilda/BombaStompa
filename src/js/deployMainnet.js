// import libraries
const Web3 = require('web3');
const fs = require('fs');
const contractInfo = require(__dirname + "/../" + "../build/contracts/Manager.json");

// get the private key
const PrivateKeyProvider = require("truffle-privatekey-provider");
const privateKey = "";
const provider = new PrivateKeyProvider(privateKey, 'https://mainnet.infura.io/');

const web3 = new Web3(provider);

// deploy contract
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account: ', accounts[0]);

    const result = await new web3.eth.Contract(contractInfo.abi)
    .deploy({ data: contractInfo.bytecode })
    .send({ gas: 3000000, gasPrice: 2000000000 , from: accounts[0]}, async (err, res) => {
        if(err) console.error(err);
        else console.log(res);
    });

    //This will display the address to which your contract was deployed
    console.log('Contract deployed to: ', result.options.address);
};
deploy();
