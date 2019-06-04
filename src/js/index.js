// The app interface
App = {
	// the web3 library providor (mostly MetaMask)
	currentWeb3Provider: null,
	manager: null,
	managerInst: null,
	
	// get the web3 interface running!
	initWeb3: async () =>{
        // manage the account status text every 500 mSec
        setInterval(App.accStatus, 500);

		if(window.ethereum){
			// only on new versions of MetaMask
			currentWeb3Provider = window.ethereum;
			try{
				// enable the account
				await window.ethereum.enable();
				console.log("Web3 is MetaMask");
			} catch(error){
				console.log("User denied access to his account");
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
        // TODO delegate to a file managed by nodejs with different networks
		managerInst = manager.at("0x3a5bB4ee427F4b5545E3d656B49910fC8af3Ac2D");
	},

	// function to add a hash to the timestamp services
	addHash: async () => {
        // get the parameters from the document
        // TODO sanitize input
		hToAdd = document.getElementById("addHashHash").value;
		nToAdd = document.getElementById("addHashName").value;
		
		// call the web3 function
		managerInst.addHash(nToAdd, hToAdd, async (err, res) => {
			// if got error display and handle it
			if(err) console.log(err);

			// log the transaction hash
			else{
                document.getElementById("addHash").innerText = "Transaction hash is: " + res;
            };
		});
    },
    
    // gets the hash for a given name and displays it
    getHash: async () => {
        // getting the name to retrieve
        nToGet = document.getElementById("getHashName").value;

        // call to web3
        managerInst.getHash(nToGet, async (err, res) => {
            // returned error
            if(err) console.log(err);

            // no error; display the hash and timestamp
            else{
                document.getElementById("resHash").innerText = "The hash is: " + res[0] + 
                                                               ", the timestamp is: " + new Date(res[1] * 1000);
            }
        });

    },

    // deletes the hash with the given name owned by the account
    delHash: async () => {
        // getting the hash to delete
        nToDel = document.getElementById("delHashName").value;

        // call to web3
        managerInst.deleteHash(nToDel, async (err, res) => {
            // display error
            if(err) console.log(err);

            // no error, reutrn the transaction hash
            else{
                // display the transaction hash
                document.getElementById("delHash").innerText = "Transaction hash is: " + res;
            }
        });
    },

    // manage the account status text
    accStatus: async () => {
        var status = "";
        
        // check if metamask is connected
        if(currentWeb3Provider == window.ethereum){
            // no accounts enabled
            if(web3.eth.accounts.length == 0){
                status = "connected to MetaMask, account not connected, press enable";
            }else{
                // account enabled, display its address
                status = "connected to MetaMask account: " + web3.eth.accounts[0]; 
            }
        }else{
            // MetaMask not connected, install or enable in chrome
            status = "MetaMask not connected"
        }

        //display the current status
        document.getElementById("accountStatus").innerText = status;
    }
};

// when the window hash loaded start the app
window.onload = async () => {
    App.initWeb3();
}
