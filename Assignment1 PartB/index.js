var {Web3} = require('web3');
var contractAddr = '0x15089d195f728e0a2ec534104d8c89cf88f66243';

const storageABI475 = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "DocumentRetrieved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "DocumentStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			}
		],
		"name": "storeDocument475",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDocument475",
		"outputs": [
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "storedHash",
				"type": "bytes32"
			},
			{
				"internalType": "bool",
				"name": "integrity",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

var callStoreOnLocalGanache475 = async function () {
  // let web3 = new Web3("http://localhost:8545");
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  console.log(web3.eth.defaultAccount);
  // var CoursetroContract = new web3.eth.Contract(abi);
  // var Coursetro = CoursetroContract.at(contractAddr);
  var myContract = new web3.eth.Contract(storageABI475, contractAddr, { from: web3.eth.defaultAccount })
  console.log(myContract);
  let num = "650";
  // function store(uint256 num)
  myContract.methods.storeDocument475(num)
    .send({ from: web3.eth.defaultAccount })
    .then(function (recippt) {
      console.log("recippt send:", recippt, null, 4)
    }).
    catch(error => {
      console.log(error)
    }
    )
}

var callRetrieveOnLocalGanache475 = async function () {
  // let web3 = new Web3("http://localhost:8545");
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  console.log(web3.eth.defaultAccount);
  // var CoursetroContract = new web3.eth.Contract(abi);
  // var Coursetro = CoursetroContract.at(contractAddr);
  var myContract = new web3.eth.Contract(storageABI475, contractAddr, { from: web3.eth.defaultAccount })

  console.log(myContract);
  // function store(uint256 num)
  myContract.methods.getDocument475()
    .call({ from: web3.eth.defaultAccount })
    .then(function (recippt) {
      console.log("recippt:", JSON.stringify(recippt, null, 4))
    }).
    catch(error => {
      console.log(error)
    }
    )
}

callStoreOnLocalGanache475().then(() => {
  setTimeout(function () {
    // if (newState == -1) {
      callRetrieveOnLocalGanache475();

    // }
}, 500);
})
  .catch(msg => {
    console.log(msg);
  });