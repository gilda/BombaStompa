const Web3 = require('web3');
const fs = require('fs');
const contractInfo = require(__dirname + "/../" + "../build/contracts/Manager.json");
const PrivateKeyProvider = require("truffle-privatekey-provider");
const privateKey = "";
const provider = new PrivateKeyProvider(privateKey, 'https://ropsten.infura.io/');

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account: ', accounts[0]);

    const result = await new web3.eth.Contract(contractInfo.abi)
    .deploy({ data: contractInfo.bytecode })
    .send({ gas: '1500000', gasPrice: 100000000000 , from: accounts[0]});

    //This will display the address to which your contract was deployed
    console.log('Contract deployed to: ', result.options.address);
};
deploy();
