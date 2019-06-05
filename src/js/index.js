// The app interface
App = {
	// the web3 library providor (mostly MetaMask)
	currentWeb3Provider: null,
	manager: null,
    managerInst: null,
    networkName: null,
	
	// get the web3 interface running!
	initWeb3: async () =>{
        // manage the account status text every 500 mSec
        setInterval(App.accStatus, 500);
        // manage the network status text every 2000 mSec
        setInterval(App.netStatus, 2000);

		if(window.ethereum){
			// only on new versions of MetaMask
			currentWeb3Provider = window.ethereum;
			try{
				// enable the account
				await window.ethereum.enable();
			} catch(error){
                console.error(error);
			}
		}else if(window.web3){
			// old dApp browser
			currentWeb3Provider = window.web3.currentWeb3Provider;
		}else{
			// local RPC
			currentWeb3Provider = Web3.providers.HttpProvider('http://localhost:7545');
		}
		
		// construct the main object to interact with ethtereum
		web3 = new Web3(currentWeb3Provider);
        
        // initial check for account and network
        await App.accStatus();
        
        // init the contract with network params
        await App.netStatus();

		return;
	},

	// get the contract interface up and running
	initContract: async (id) => {
		manager = web3.eth.contract(contractInfo[0].abi);

        // IMPORTANT!!! update the address of the contract
        contractAddresses = {mainnet: "", ropsten: "", ganache: "0x3a5bB4ee427F4b5545E3d656B49910fC8af3Ac2D"};
        
        let address;
        if(id == 1) address = contractAddresses.mainnet;
        if(id == 3) address = contractAddresses.ropsten;
        if(id == 5777) address = contractAddresses.ganache;

        // initiate the contract with the current address
        managerInst = manager.at(address);
        return address;
	},

	// function to add a hash to the timestamp services
	addHash: async () => {
        // TODO blink or alert user of insufficient data to call web3 function
        // make sure the contract is implemented in this network
        if(managerInst.address == "") return;

        // get the parameters from the document
        hToAdd = document.getElementById("addHashHash").value;
        if(hToAdd == "") return;
        
        // check that it is a valid hash
        if(!(/0x[0-9A-Fa-f]{64}/g).test(hToAdd)){
            document.getElementById("addHashHash").value = "this is not a valid hash!!!";
            return;
        }

        // no checks needed for string 
        nToAdd = document.getElementById("addHashName").value;
        if(nToAdd == "") return;
        
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
        if(nToGet == "") return;

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
        // make sure the contract is implemented in this network
        if(managerInst.address == "") return;

        // getting the hash to delete
        nToDel = document.getElementById("delHashName").value;
        if(nToDel == "") return;

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
        var netStatus = "";
        
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
    },
    
    // manage the netowrk status text
    netStatus: async () => {
        web3.version.getNetwork(async (err, res) => {
            if(err) console.error(err);

            // mainnet
            else if(res == 1){
                networkName = "Mainnet";
            }
            // ropsten
            else if(res == 3){
                networkName = "Ropsten";
            }
            // ganache
            else if(res == 5777){
                networkName = "Ganache";
            }

            // init the contract abi and address into web3 object
            address = await App.initContract(res);

            // notify user of contract address status
            if(address.length == 0) document.getElementById("netStatus").innerText = "No contract implementation on this network (" + networkName + ")\nPlease change the MetaMask network";
            else document.getElementById("netStatus").innerText = "Connected to " + networkName;
        });
    }
};

// when the window hash loaded start the app
window.onload = async () => {
    App.initWeb3();
}
