require('dotenv').config();
const { ethers } = require('ethers');
const { logAction } = require('./logger');

const provider = new ethers.JsonRpcProvider(
  process.env.HSK_RPC_URL,
  null,
  { staticNetwork: ethers.Network.from(parseInt(process.env.HSK_CHAIN_ID)) }
);

async function askAI(prompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    })
  });
  const data = await res.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    return 'AI analysis temporarily unavailable. Please try again.';
  }
  return data.choices[0].message.content;
}

async function run(wallet) {
  if (!wallet) return { reply: 'Please provide a wallet address to score.' };

  try {
    const balance = await provider.getBalance(wallet);
    const txCount = await provider.getTransactionCount(wallet);
    const balanceHSK = ethers.formatEther(balance);

    const prompt =
      'You are a DeFi risk analyst on HashKey Chain. Score this wallet from 1-100 (100 = safest).\n' +
      'Wallet: ' + wallet + '\n' +
      'HSK Balance: ' + balanceHSK + '\n' +
      'Total Transactions: ' + txCount + '\n' +
      'Reply with: Risk Score: X/100, then 2 sentences of analysis.';

    const analysis = await askAI(prompt);

    const reply =
      'Risk Score Report:\n' +
      'Address: ' + wallet + '\n' +
      'Balance: ' + balanceHSK + ' HSK\n' +
      'Transactions: ' + txCount + '\n\n' +
      'AI Analysis:\n' + analysis;

    logAction(wallet, 'risk', reply);
    return { reply };
  } catch (err) {
    return { reply: 'Risk error: ' + err.message };
  }
}

module.exports = { run };
