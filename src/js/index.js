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
        contractAddresses = {mainnet: "0xffe0daa7b7abfaa8199f37884a07b9f486c31e11", ropsten: "0x78cc922765c30164be0f53177d93e6d7e13d40ca", ganache: "0x3a5bB4ee427F4b5545E3d656B49910fC8af3Ac2D"};
        
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
        // make sure the contract is implemented in this network
        if(managerInst.address == "") {
            // alert the user
            document.getElementById("addHashAlert").innerHTML = 
            "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>No contract implementation on this network (" + networkName + ")</div>";
            
            // nice fade in animation to alerts
            window.setTimeout(() => {
                $(".alert").fadeTo(500, 0).slideUp(500, () => {
                    $(this).remove(); 
                });
            }, 4000);
            return;
        }

        // get the parameters from the document
        hToAdd = document.getElementById("addHashHash").value;
        if(hToAdd == ""){
            document.getElementById("addHashAlert").innerHTML = 
            "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>A hash to submit is required!</div>";
            
            // nice fade in animation to alerts
            window.setTimeout(() => {
                $(".alert").fadeTo(500, 0).slideUp(500, () => {
                    $(this).remove(); 
                });
            }, 4000);
            return;
        }
        
        // check that it is a valid hash
        if(!(/0x[0-9A-Fa-f]{64}/g).test(hToAdd)){
            document.getElementById("addHashHash").value = "this is not a valid hash!!!";
            return;
        }

        // no checks needed for string 
        nToAdd = document.getElementById("addHashName").value;
        if(nToAdd == ""){
            document.getElementById("addHashAlert").innerHTML = 
            "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>A name for the submission is required!</div>";
            
            // nice fade in animation to alerts
            window.setTimeout(() => {
                $(".alert").fadeTo(500, 0).slideUp(500, () => {
                    $(this).remove(); 
                });
            }, 4000);
            return;
        } 

		// call the web3 function
		managerInst.addHash(nToAdd, hToAdd, async (err, res) => {
			// if got error display and handle it
			if(err) console.log(err);

			// log the transaction hash
			else{
                document.getElementById("addHash").innerText = "Transaction hash is: " + res;
            };
		}).on("reciept", async () => {
            document.getElementById("addHash").innerText += "\n Transaction confirmed!"
        });
    },
    
    // gets the hash for a given name and displays it
    getHash: async () => {
        // make sure the contract is implemented in this network
        if(managerInst.address == "") {
            // alert the user
            document.getElementById("getHashAlert").innerHTML = 
            "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>No contract implementation on this network (" + networkName + ")</div>";
            
            // nice fade in animation to alerts
            window.setTimeout(() => {
                $(".alert").fadeTo(500, 0).slideUp(500, () => {
                    $(this).remove(); 
                });
            }, 4000);            
            return;
        }

        // getting the name to retrieve
        nToGet = document.getElementById("getHashName").value;
        
        if(nToGet == ""){
            document.getElementById("getHashAlert").innerHTML = 
            "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>A name to retrieve the submission is required!</div>";

            // nice fade in animation to alerts
            window.setTimeout(() => {
                $(".alert").fadeTo(500, 0).slideUp(500, () => {
                    $(this).remove(); 
                });
            }, 4000);            
            return;
        }

        // call to web3
        managerInst.getHash(nToGet, async (err, res) => {
            // returned error
            if(err) console.log(err);

            // no error; display the hash and timestamp
            else{
                // num to hex
                var h = "0x";
                for(i = 0; i < 64-res[0].toString(16).length; i++){
                    h += "0"
                }

                // handle this thing github.com/ethereum/web3.js/issues/1903
                if(h + res[0].toString(16) == "0x08c379a000000000000000000000000000000000000000000000000000000000"){
                    document.getElementById("getHashAlert").innerHTML = 
                    "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>This entry does not exist</div>";
                    return;
                }

                // did not revert
                document.getElementById("resHash").innerText = "The hash is: " + h + res[0].toString(16) + 
                                                               ", the timestamp is: " + new Date(res[1] * 1000);
            }
        }).on("reciept", async () => {
            document.getElementById("getHash").innerText += "\n Transaction confirmed!"
        });

    },

    // deletes the hash with the given name owned by the account
    delHash: async () => {
        // make sure the contract is implemented in this network
        if(managerInst.address == "") {
            // alert the user
            document.getElementById("delHashAlert").innerHTML = 
            "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>No contract implementation on this network (" + networkName + ")</div>";
            
            // nice fade in animation to alerts
            window.setTimeout(() => {
                $(".alert").fadeTo(500, 0).slideUp(500, () => {
                    $(this).remove(); 
                });
            }, 4000);
            return;
        }

        // getting the hash to delete
        nToDel = document.getElementById("delHashName").value;
        if(nToDel == ""){
            document.getElementById("delHashAlert").innerHTML = 
            "<div class='alert alert-danger'><a class='close' data-dismiss='alert'>X</a>A name to delete the submission is required!</div>";
            
            // nice fade in animation to alerts
            window.setTimeout(() => {
                $(".alert").fadeTo(500, 0).slideUp(500, () => {
                    $(this).remove(); 
                });
            }, 4000);            
            return;
        }

        // call to web3
        managerInst.deleteHash(nToDel, async (err, res) => {
            // display error
            if(err) console.log(err);

            // no error, reutrn the transaction hash
            else{
                // display the transaction hash
                document.getElementById("delHash").innerText = "Transaction hash is: " + res;
            }
        }).on("reciept", async () => {
            document.getElementById("delHash").innerText += "\n Transaction confirmed!"
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
