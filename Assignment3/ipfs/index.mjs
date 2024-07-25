import Web3 from 'web3';
import { create } from 'ipfs-http-client';


// Initialize the IPFS client
const client475 = create('http://127.0.0.1:6001');

const MFS_path475 = "/files_";

let document475 = "This is a purchase document!";
let defaultAcc475;
let h, r, s, v;
let web3, myContract475;

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545/"));

const callStoreOnLocalGanache475 = async function () {
    try {
        const accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[0];
        defaultAcc475 = web3.eth.defaultAccount;
        console.log("Default Account:", defaultAcc475);

        myContract475 = new web3.eth.Contract(abi, contractAddr, { from: defaultAcc475 });

        h = web3.utils.soliditySha3(document475);
        const signature = await web3.eth.sign(h, defaultAcc475); // using ECDSA
		console.log("MFS: ",MFS_path475 + h.replace("0x", ""), signature);

        await client475.files.write(
            MFS_path475 + h.replace("0x", ""),
            new TextEncoder().encode(signature),
            { create: true}
        );

        await myContract475.methods
            .setIpfsCid475(h.replace("0x", ""))
            .send({ from: web3.eth.defaultAccount });

        console.log("Document stored successfully!");

    } catch (error) {
        console.error("Error in callStoreOnLocalGanache:", error);
    }
};

const callRetrieveOnLocalGanache475 = async function () {
    try {
        const cid = await myContract475.methods
            .getIpfsCid475()
            .call({ from: web3.eth.defaultAccount });
		console.log("CID Retrieved:", cid);

        const stat = await client475.files.stat(MFS_path475 + cid, { hash: true });

        const ipfsAddr = stat.cid.toString();
        console.log("IPFS Address:", ipfsAddr);

        const resp = await client475.cat(ipfsAddr);
        let content = [];
        for await (const chunk of resp) {
            content = [...content, ...chunk];
        }
        const raw = Buffer.from(content).toString("utf8");
        console.log("File content:", raw);

        r = raw.slice(0, 66);
        s = "0x" + raw.slice(66, 130);
        v = web3.utils.toDecimal("0x" + raw.slice(130, 132)) + 27;

        console.log("Recovered values:", { r, s, v });

    } catch (error) {
        console.error("Error in callRetrieveOnLocalGanache:", error);
    }
};

const verifyDocumentOnLocalGanache475 = async function (accountToBeVerified) {
    try {
        const cid = await myContract475.methods.getIpfsCid475().call({ from: web3.eth.defaultAccount });
        console.log("CID Retrieved:", cid);

        const stat = await client475.files.stat(MFS_path475 + cid, { hash: true });
        const ipfsAddr = stat.cid.toString();
        console.log("IPFS Address:", ipfsAddr);

        const resp = await client475.cat(ipfsAddr);
        let content = [];
        for await (const chunk of resp) {
            content = [...content, ...chunk];
        }
        const raw = Buffer.from(content).toString("utf8");
        console.log("File content:", raw);

        const r = raw.slice(0, 66);
        const s = "0x" + raw.slice(66, 130);
        const v = web3.utils.toDecimal("0x" + raw.slice(130, 132)) + 27;

        console.log("Recovered values:", { r, s, v });

        const message = web3.utils.soliditySha3(document475);
        const signer = await myContract475.methods.verify475(message, v, r, s).call();

        if (signer.toLowerCase() === accountToBeVerified.toLowerCase()) {
            console.log("Signature is valid and signer is:", signer);
        } else {
            console.log("Signature is invalid or signer does not match:", signer);
        }
    } catch (error) {
        console.error("Error in verifyDocumentOnLocalGanache:", error);
    }
};


let contractAddr = '0xa1b8f489ca97ff1fb153bb947466a16df85c01fa';
let abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newwords",
				"type": "string"
			}
		],
		"name": "setIpfsCid475",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIpfsCid475",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_message",
				"type": "bytes"
			},
			{
				"internalType": "uint8",
				"name": "_v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "_r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_s",
				"type": "bytes32"
			}
		],
		"name": "verify475",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
]	

callStoreOnLocalGanache475().then(() => {
  setTimeout(function () {
    callRetrieveOnLocalGanache475();
    setTimeout(function () {
		verifyDocumentOnLocalGanache475(defaultAcc475);
    }, 1500);
  }, 500);
})
  .catch(msg => {
    console.log(msg);
  });
