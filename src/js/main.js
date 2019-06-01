// required libraries
let http = require('http');
let fs = require('fs');
let url = require('url');

// constants
const port = 4464;
const dir = __dirname + "/../";

// main code for the server
let Server = http.createServer(async (req, res) => {
	// 200 OK
	res.writeHead(200);
	let data = url.parse(req.url, true).query;

	// default is index.html
	if(req.url == "/") req.url = "index.html";
	
	// get the contract abi into a json object to be used in the client side
	if(req.url == "/abi.js") return res.end("var contractInfo = [" + 
											fs.readFileSync(dir + "../build/contracts/Manager.json").toString().replace(/[\u0000-\u0019]+/g,"") + "];");

	// no js files
	if(req.url.includes("main.js")) return res.writeHead(401);
	
	// no favicon yet
	if(req.url == "/favicon.ico") return res.writeHead(404);

	// serve correct file
	return res.end(fs.readFileSync(dir + req.url));
});

// start the server
Server.listen(port);
