import express from 'express';
import { ethers } from 'ethers';
import cors from 'cors';
import multer from 'multer';
import { create } from 'ipfs-core';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import retry from 'async-retry';
import http from 'http';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Increase max sockets
http.globalAgent.maxSockets = 20;

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const contractABI = [
  "function createEvidence(uint id, string memory description) public",
  "function transfer(uint id, address newOwner) public",
  "function removeEvidence(uint id) public",
  "function addLog(uint id, string memory log) public",
  "function setIpfsHash(uint id, string memory ipfsHash) public",
  "function grantAccess(uint id, address viewer) public",
  "function revokeAccess(uint id, address viewer) public",
  "function getEvidenceBasic(uint id) view public returns(uint, address, address, string memory)",
  "function getEvidenceDetails(uint id) view public returns(address[] memory, uint[] memory, string[] memory, string memory)"
];

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Create an IPFS node
let ipfs;
(async () => {
  try {
    ipfs = await create();
    console.log('IPFS node is ready');
  } catch (error) {
    console.error('Failed to create IPFS node:', error);
  }
})();

app.post('/createEvidence', async (req, res) => {
  try {
    const { id, description } = req.body;
    
    // Estimate gas for the transaction
    const gasEstimate = await contract.estimateGas.createEvidence(id, description);
    
    // Add a buffer to the gas estimate
    const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer

    const tx = await contract.createEvidence(id, description, { gasLimit });
    const receipt = await tx.wait();
    res.json({ success: true, message: 'Evidence created successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error creating evidence:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/uploadToIpfs', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  if (!ipfs) {
    return res.status(500).json({ success: false, error: 'IPFS node is not ready' });
  }

  try {
    console.log('Attempting to upload file to IPFS...');
    const fileBuffer = req.file.buffer;
    
    const result = await retry(async (bail) => {
      try {
        const addResult = await ipfs.add({
          path: req.file.originalname,
          content: Readable.from(fileBuffer)
        });
        if (!addResult || !addResult.cid) {
          throw new Error('IPFS add failed to return a valid CID');
        }
        return addResult;
      } catch (err) {
        console.error('IPFS add error:', err);
        throw err;  // This will trigger a retry
      }
    }, {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 5000,
      onRetry: (error, attempt) => {
        console.log(`Retrying IPFS upload (attempt ${attempt}) due to error:`, error);
      },
    });

    const ipfsHash = result.cid.toString();
    console.log('File uploaded successfully. IPFS Hash:', ipfsHash);
    res.json({ success: true, ipfsHash });
  } catch (error) {
    console.error('IPFS upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/setIpfsHash', async (req, res) => {
  try {
    const { id, ipfsHash } = req.body;
    
    const gasEstimate = await contract.estimateGas.setIpfsHash(id, ipfsHash);
    const gasLimit = gasEstimate.mul(120).div(100);

    const tx = await contract.setIpfsHash(id, ipfsHash, { gasLimit });
    const receipt = await tx.wait();
    res.json({ success: true, message: 'IPFS hash set successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error setting IPFS hash:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/transfer', async (req, res) => {
  try {
    const { id, newOwner } = req.body;
    
    const gasEstimate = await contract.estimateGas.transfer(id, newOwner);
    const gasLimit = gasEstimate.mul(120).div(100);

    const tx = await contract.transfer(id, newOwner, { gasLimit });
    const receipt = await tx.wait();
    res.json({ success: true, message: 'Evidence transferred successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error transferring evidence:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/removeEvidence', async (req, res) => {
  try {
    const { id } = req.body;
    
    const gasEstimate = await contract.estimateGas.removeEvidence(id);
    const gasLimit = gasEstimate.mul(120).div(100);

    const tx = await contract.removeEvidence(id, { gasLimit });
    const receipt = await tx.wait();
    res.json({ success: true, message: 'Evidence removed successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error removing evidence:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/addLog', async (req, res) => {
  try {
    const { id, log } = req.body;
    
    const gasEstimate = await contract.estimateGas.addLog(id, log);
    const gasLimit = gasEstimate.mul(120).div(100);

    const tx = await contract.addLog(id, log, { gasLimit });
    const receipt = await tx.wait();
    res.json({ success: true, message: 'Log added successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error adding log:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/grantAccess', async (req, res) => {
  try {
    const { id, viewer } = req.body;
    
    const gasEstimate = await contract.estimateGas.grantAccess(id, viewer);
    const gasLimit = gasEstimate.mul(120).div(100);

    const tx = await contract.grantAccess(id, viewer, { gasLimit });
    const receipt = await tx.wait();
    res.json({ success: true, message: 'Access granted successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/revokeAccess', async (req, res) => {
  try {
    const { id, viewer } = req.body;
    
    const gasEstimate = await contract.estimateGas.revokeAccess(id, viewer);
    const gasLimit = gasEstimate.mul(120).div(100);

    const tx = await contract.revokeAccess(id, viewer, { gasLimit });
    const receipt = await tx.wait();
    res.json({ success: true, message: 'Access revoked successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error revoking access:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/getEvidenceBasic/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const evidence = await contract.getEvidenceBasic(id);
    res.json({
      success: true,
      evidence: {
        id: evidence[0].toString(),
        owner: evidence[1],
        creator: evidence[2],
        description: evidence[3]
      }
    });
  } catch (error) {
    console.error('Error getting basic evidence:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/getEvidenceDetails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const evidence = await contract.getEvidenceDetails(id);
    res.json({
      success: true,
      evidence: {
        addresses: evidence[0],
        times: evidence[1].map(time => time.toString()),
        logs: evidence[2],
        ipfsHash: evidence[3]
      }
    });
  } catch (error) {
    console.error('Error getting evidence details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});