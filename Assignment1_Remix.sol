// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentStorage475 {
    struct Document {
        string content;
        bytes32 hash;
    }

    mapping(address => Document) private documents;

    event DocumentStored(address indexed user, bytes32 hash);
    event DocumentRetrieved(address indexed user, string content, bytes32 hash);

    // Store document
    function storeDocument475(string memory _content) public {
        bytes32 hash = keccak256(abi.encodePacked(_content));
        documents[msg.sender] = Document(_content, hash);
        emit DocumentStored(msg.sender, hash);
    }

    // Get document and verify its integrity
    function getDocument475() public view returns (string memory content, bytes32 storedHash, bool integrity) {
        Document memory doc = documents[msg.sender];
        bytes32 calculatedHash = keccak256(abi.encodePacked(doc.content));
        bool integrityCheck = (calculatedHash == doc.hash);
        return (doc.content, doc.hash, integrityCheck);
    }
}
