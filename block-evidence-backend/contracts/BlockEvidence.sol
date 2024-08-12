// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockEvidence {
    struct Evidence {
        uint id;
        address creator;
        address owner;
        string description;
        address[] addr;
        uint[] time;
        string[] logs;
        string ipfsHash;
    }

    mapping (uint => Evidence) private evidences;
    mapping (uint => mapping(address => bool)) private accessControl;

    modifier OnlyOwner(uint id) {
        require(msg.sender == evidences[id].owner, "Not the Owner");
        _;
    }

    modifier OnlyCreator(uint id) {
        require(msg.sender == evidences[id].creator, "Not the Creator");
        _;
    }

    modifier EvidenceExists(uint id, bool mustExist) {
        bool exists = evidences[id].id != 0;
        if (mustExist)
            require(id != 0 && exists, "Evidence must exist");
        else
            require(!exists, "Evidence must not exist");
        _;
    }

    function createEvidence(uint id, string memory description) public EvidenceExists(id, false) {
        require(id != 0, "ID cannot be zero");
        evidences[id].id = id;
        evidences[id].owner = msg.sender;
        evidences[id].creator = msg.sender;
        evidences[id].description = description;
        evidences[id].addr.push(msg.sender);
        evidences[id].time.push(block.timestamp);
    }

    function transfer(uint id, address newOwner) public OnlyOwner(id) EvidenceExists(id, true) {
        evidences[id].owner = newOwner;
        evidences[id].addr.push(newOwner);
        evidences[id].time.push(block.timestamp);
    }

    function removeEvidence(uint id) public OnlyCreator(id) EvidenceExists(id, true) {
        delete evidences[id];
    }

    function addLog(uint id, string memory log) public OnlyOwner(id) EvidenceExists(id, true) {
        evidences[id].logs.push(log);
    }

    function setIpfsHash(uint id, string memory ipfsHash) public OnlyOwner(id) EvidenceExists(id, true) {
        evidences[id].ipfsHash = ipfsHash;
    }

    function grantAccess(uint id, address viewer) public OnlyOwner(id) EvidenceExists(id, true) {
        accessControl[id][viewer] = true;
    }

    function revokeAccess(uint id, address viewer) public OnlyOwner(id) EvidenceExists(id, true) {
        accessControl[id][viewer] = false;
    }

    function getEvidenceBasic(uint id) view public returns(uint, address, address, string memory) {
        require(msg.sender == evidences[id].owner || accessControl[id][msg.sender], "Access denied");
        return (
            evidences[id].id,
            evidences[id].owner,
            evidences[id].creator,
            evidences[id].description
        );
    }

    function getEvidenceDetails(uint id) view public returns(address[] memory, uint[] memory, string[] memory, string memory) {
        require(msg.sender == evidences[id].owner || accessControl[id][msg.sender], "Access denied");
        return (
            evidences[id].addr,
            evidences[id].time,
            evidences[id].logs,
            evidences[id].ipfsHash
        );
    }
}