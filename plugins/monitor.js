require('dotenv').config();
const { ethers } = require('ethers');
const { logAction } = require('./logger');

const provider = new ethers.JsonRpcProvider(
  process.env.HSK_RPC_URL,
  null,
  { staticNetwork: ethers.Network.from(parseInt(process.env.HSK_CHAIN_ID)) }
);

async function run(wallet) {
  if (!wallet) return { reply: 'Please provide a wallet address to monitor.' };

  try {
    const balance = await provider.getBalance(wallet);
    const txCount = await provider.getTransactionCount(wallet);
    const block = await provider.getBlockNumber();

    const reply =
      'Wallet Monitor Report:\n' +
      'Address: ' + wallet + '\n' +
      'Balance: ' + ethers.formatEther(balance) + ' HSK\n' +
      'Total Transactions: ' + txCount + '\n' +
      'Current Block: ' + block + '\n' +
      'Explorer: ' + process.env.HSK_EXPLORER + '/address/' + wallet;

    logAction(wallet, 'monitor', reply);
    return { reply };
  } catch (err) {
    return { reply: 'Monitor error: ' + err.message };
  }
}

module.exports = { run };
