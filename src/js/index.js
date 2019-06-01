// The app interface
App = {
	// the web3 library providor (mostly MetaMask)
	currentWeb3Provider: null,
	manager: null,
	managerInst: null,
	
	// get the web3 interface running!
	// TODO handle accounts better
	initWeb3: async () =>{
		if(window.ethereum){
			// only on new versions of MetaMask
			currentWeb3Provider = window.ethereum;
			try{
				// enable the account
				window.ethereum.enable();
				console.log("Web3 is MetaMask");
			} catch(error){
				console.error("User denied access to his account");
			}
		}else if(window.web3){
			// old dApp browser
			currentWeb3Provider = window.web3.currentWeb3Provider;
			console.log("Web3 is generic web3");
		}else{
			// local RPC
			currentWeb3Provider = Web3.providers.HttpProvider('http://localhost:7545');
			console.log("Web3 is Ganache");
		}
		
		// construct the main object to interact with ethtereum
		web3 = new Web3(currentWeb3Provider);

		// init the contract
		return App.initContract();
	},

	// get the contract interface up and running
	initContract: async () => {
		manager = web3.eth.contract(contractInfo[0].abi);
		
		// IMPORTANT!!! update the address of the contract
		// TODO delegate to a file managed by nodejs
		managerInst = manager.at("0x5A68Fa0930f90A5aa8E1048210CbBedd9A1B7b65");
	},

	// function to add a hash to the timestamp services
	addHash: async () => {
		// get the parameters from the document
		hToAdd = document.getElementById("addHashHash").value;
		nToAdd = document.getElementById("addHashName").value;
		console.log(hToAdd + " " + nToAdd);
		
		// call the web3 function
		// TODO handle errors
		managerInst.addHash(nToAdd, hToAdd, async (err, res) => {
			// if got error display and handle it
			if(err) console.error(err);

			// log the transaction hash
			// TODO possibly display the hash to the user
			else console.log("Transaction Hash: " + res);
		});
	}

	// TODO getHash
	// TODO deleteHash
};

// when the window hash loaded start the app
window.onload = async () => {
	App.initWeb3();
}
