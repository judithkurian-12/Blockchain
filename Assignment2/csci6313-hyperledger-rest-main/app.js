'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const AppUtil = require('./lib/AppUtil.js');
const { buildWallet } = require('./lib/AppUtil.js');
const walletPath = path.join(__dirname, 'Org1');
// http server config
const http = require('http');
const url = require('url');
const host = '0.0.0.0';
const port = 8952;

// $.get("http://noodlenami.com:8080/ak/api/v1/components").done(function (contents) {
// 	console.log("buildJunglekidsOrg1 from profile:", JSON.stringify(contents, null, 4))
// 	completeProfile = JSON.parse(contents);
// });


/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 *
 * curl http://console.127.0.0.1.nip.io:8080/ak/api/v1/components
curl http://console.127.0.0.1.nip.io:8080/ak/api/v1/components | jq '.[] | select(.type == "gateway")'
curl http://noodlenami.com:28080/ak/api/v1/components | jq '.[] | select(.type == "identity")'

 */

let identity = 'Org1 Admin';
let networkConnections = {};
let gateway = null;
let network = null;
let contract = null;

async function initializeHyperledgerNetowrk475() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = AppUtil.buildJunglekidsOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		// const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);
		if (gateway === null){
			gateway = new Gateway();
		}

		if (network === null) {

			console.log('Build a network instance');
			await gateway.connect(ccp, {
				wallet,
				identity: identity,
				// clientTlsIdentity:'actorfsmmodeladmin',
				// tlsInfo: {
				// 	certificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUI0RENDQVlhZ0F3SUJBZ0lRT1BVMG4yZWNzZEtWeUJ6K2M3b1NvekFLQmdncWhrak9QUVFEQWpBYk1Sa3cKRndZRFZRUURFeEJoWTNSdmNtWnpiVzF2WkdWc0lFTkJNQjRYRFRJeE1EY3hPREUwTURnd04xb1hEVE14TURjeApOakUwTURnd04xb3dMakVPTUF3R0ExVUVDeE1GWVdSdGFXNHhIREFhQmdOVkJBTVRFMkZqZEc5eVpuTnRiVzlrClpXd2dRV1J0YVc0d1dUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DQUFRNTYzaWgrMHN0dUlMUzVMWDQKY0VWWERhSnM5a2JQYUgrYTdPeWMvMEhYREtOZWpuMEFmeDA4SkcvaG4xanliRjIyK3Q5Wmd4LzBYZ1JsZ3RBQwpUZzFDbzRHWU1JR1ZNQTRHQTFVZER3RUIvd1FFQXdJRm9EQWRCZ05WSFNVRUZqQVVCZ2dyQmdFRkJRY0RBZ1lJCkt3WUJCUVVIQXdFd0RBWURWUjBUQVFIL0JBSXdBREFwQmdOVkhRNEVJZ1FnalViWnVmSS82SlJkWDFKUDdKMEYKMkk0cm5ZU0JMbjlpaGI2cjN1dURDMUV3S3dZRFZSMGpCQ1F3SW9BZ25aaERTK1B3czNvQXB5RmFyVzc2eXdiNwozRTBYb2RtNVExcjhaeng5eGRjd0NnWUlLb1pJemowRUF3SURTQUF3UlFJaEFPdUNTSjhTSFA3UFJWSU9sc2RxCnZRNWVwdklxYllSbUhmMURWRzU4NkYxQ0FpQUU0QmxhcVhTdEZPRU1WRHFzSmxoRzQ1aGRuL0F2MGI2SVlRNVYKU0JCQ2Z3PT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",

				// 	key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZ3FXUmphNGgyd3FveWxYYmYKUC9WZHNycHY0RHE0SWVZaWYveThOZ3FnZFVHaFJBTkNBQVE1NjNpaCswc3R1SUxTNUxYNGNFVlhEYUpzOWtiUAphSCthN095Yy8wSFhES05lam4wQWZ4MDhKRy9objFqeWJGMjIrdDlaZ3gvMFhnUmxndEFDVGcxQwotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg==",

				// },
				discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

		}

	} catch (error) {
		console.error(`******** getHyperledgerGateway: ${error}`);
	}
}

async function initializeHyperledgerContract475() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		// const ccp = AppUtil.buildJunglekidsOrg1();

		// Build a network instance based on the channel where the smart contract is deployed
		console.log('Build a network instance based on the channel where the smart contract is deployed');
		network = await gateway.getNetwork('channel1');

		// Get the contract from the network.
		console.log('Get the contract from the network.', network);
		contract = network.getContract('nonPrivateData');

		// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
		// await contract.submitTransaction('InitLedger', 'nonPrivateData');
		// console.log('*** Result: committed');

		networkConnections.nonPrivateData = contract;
		return contract;
	} catch (error) {
		console.error(`******** getHyperledgerGateway: ${error}`);
	}
}

async function getActorConnection475() {
	if (!networkConnections.nonPrivateData) {
		await initializeHyperledgerContract475();
	}
	return networkConnections.nonPrivateData;
}

async function createAsset475(id, value) {
	console.log('\n--> Evaluate Transaction: createAsset475, function returns "true" if an asset with given assetID exist');
	let contract = await getActorConnection475();
	let result = '';
	try {
		await contract.submitTransaction('createMyAsset', id, value);
		result = 'asset ' + id + ' was successfully created!';
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function updateAsset475(id, value) {
	console.log('\n--> Evaluate Transaction: updateMyAsset, function returns "true" if an asset with given assetID exist');
	let contract = await getActorConnection475();
	let result = '';
	try {
		await contract.submitTransaction('updateMyAsset', id, value);
		result = 'asset "'+ id + ' was successfully updated!';
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function readAsset475(id) {
	console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
	let contract = await getActorConnection475();
	let result = '';
	try {
		result = await contract.evaluateTransaction('readMyAsset', id);
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function deleteAsset475(id) {
	console.log('\n--> Evaluate Transaction: DeleteAsset, function returns "true" if an asset with given assetID exist');
	let contract = await getActorConnection475();
	let result = '';
	try {
		await contract.submitTransaction('deleteMyAsset', id);
		result = 'asset ' + id + ' was successfully deleted!';
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}



const requestListener475 = async function (req, res) {

	const queryObject = url.parse(req.url, true).query;

	console.log('req.url:', req.url);

	let result = '';
	let id = '';
	let value = '';
	res.setHeader('Content-Type', 'application/json');

	if (req.url.startsWith('/read')) {
		id = queryObject.id;
		result = await readAsset475(id);
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith('/update')) {
		value = queryObject.value;
		id = queryObject.id;
		result = await updateAsset475(id, value);
		res.writeHead(200);
		res.end(result);

	} else if (req.url.startsWith('/create')) {
		value = queryObject.value;
		id = queryObject.id;
		result = await createAsset475(id, value);
		res.writeHead(200);
		res.end(result);

	} else if (req.url.startsWith('/delete')) {
		id = queryObject.id;
		result = await deleteAsset475(id);
		res.writeHead(200);
		res.end(result);

	} else {
		res.writeHead(200);
		res.end('please specify create, update, read or delete operation...');
	}

};

const server = http.createServer(requestListener475);
server.listen(port, host, async () => {

	await initializeHyperledgerNetowrk475();
	console.log(`Server is running on http://${host}:${port}`);
});
