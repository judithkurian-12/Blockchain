import Web3 from 'web3';
import { create } from 'ipfs-http-client';


// Initialize the IPFS client
const client = create('http://127.0.0.1:6001');

const MFS_path = "/files_";

let document = "This is a purchase document!";
let defaultAcc;
let h, r, s, v;
let web3, myContract;

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545/"));

const callStoreOnLocalGanache = async function () {
    try {
        const accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[0];
        defaultAcc = web3.eth.defaultAccount;
        console.log("Default Account:", defaultAcc);

        myContract = new web3.eth.Contract(abi, contractAddr, { from: defaultAcc });

        h = web3.utils.soliditySha3(document);
        const signature = await web3.eth.sign(h, defaultAcc); // using ECDSA
		console.log("MFS: ",MFS_path + h.replace("0x", ""), signature);

        await client.files.write(
            MFS_path + h.replace("0x", ""),
            new TextEncoder().encode(signature),
            { create: true}
        );
		console.log(" After Test");

        await myContract.methods
            .setIpfsCid(h.replace("0x", ""))
            .send({ from: web3.eth.defaultAccount });

        console.log("Document stored successfully!");

    } catch (error) {
        console.error("Error in callStoreOnLocalGanache:", error);
    }
};

const callRetrieveOnLocalGanache = async function () {
    try {
        const cid = await myContract.methods
            .getIpfsCid()
            .call({ from: web3.eth.defaultAccount });
		console.log("CID Retrieved:", cid);

        const stat = await client.files.stat(MFS_path + cid, { hash: true });

        const ipfsAddr = stat.cid.toString();
        console.log("IPFS Address:", ipfsAddr);

        const resp = await client.cat(ipfsAddr);
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

const verifyDocumentOnLocalGanache = async function (accountToBeVerified) {
    try {
        const cid = await myContract.methods.getIpfsCid().call({ from: web3.eth.defaultAccount });
        console.log("CID Retrieved:", cid);

        const stat = await client.files.stat(MFS_path + cid, { hash: true });
        const ipfsAddr = stat.cid.toString();
        console.log("IPFS Address:", ipfsAddr);

        const resp = await client.cat(ipfsAddr);
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

        const message = web3.utils.soliditySha3(document);
        const signer = await myContract.methods.verify(message, v, r, s).call();

        if (signer.toLowerCase() === accountToBeVerified.toLowerCase()) {
            console.log("Signature is valid and signer is:", signer);
        } else {
            console.log("Signature is invalid or signer does not match:", signer);
        }
    } catch (error) {
        console.error("Error in verifyDocumentOnLocalGanache:", error);
    }
};


let contractAddr = '0xe9c53dcace323dcc0908cc69b148112cbea77bf3';
let abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newwords",
				"type": "string"
			}
		],
		"name": "setIpfsCid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIpfsCid",
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
		"name": "verify",
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

callStoreOnLocalGanache().then(() => {
  setTimeout(function () {
    callRetrieveOnLocalGanache();
    setTimeout(function () {
		verifyDocumentOnLocalGanache(defaultAcc);
    }, 1500);
  }, 500);
})
  .catch(msg => {
    console.log(msg);
  });
