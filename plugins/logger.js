require('dotenv').config();
const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x75C883d31193E2f53325a6E0b132Ba5C0b984F9f';

const ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "string", "name": "actionType", "type": "string" },
      { "internalType": "string", "name": "result", "type": "string" }
    ],
    "name": "recordAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function logAction(wallet, actionType, result) {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.HSK_RPC_URL,
      null,
      { staticNetwork: ethers.Network.from(parseInt(process.env.HSK_CHAIN_ID)) }
    );
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const walletAddr = wallet && ethers.isAddress(wallet) ? wallet : ethers.ZeroAddress;
    const shortResult = result.substring(0, 200);
    const tx = await contract.recordAction(walletAddr, actionType, shortResult);
    await tx.wait();
    console.log('Action logged on-chain:', tx.hash);
  } catch (err) {
    console.error('Logger error (non-critical):', err.message);
  }
}

module.exports = { logAction };
