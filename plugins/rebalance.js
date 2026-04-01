require('dotenv').config();
const { ethers } = require('ethers');
const { getHSKPrice } = require('./price');
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
      max_tokens: 400
    })
  });
  const data = await res.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    return 'AI analysis temporarily unavailable. Please try again.';
  }
  return data.choices[0].message.content;
}

async function run(wallet) {
  if (!wallet) return { reply: 'Please provide a wallet address to rebalance.' };

  try {
    const balance = await provider.getBalance(wallet);
    const balanceHSK = ethers.formatEther(balance);
    const hskData = await getHSKPrice();
    const hskPrice = hskData ? '$' + hskData.usd.toFixed(4) : 'unavailable';
    const hskChange = hskData ? hskData.usd_24h_change.toFixed(2) + '%' : 'N/A';

    const prompt =
      'You are a DeFi portfolio advisor on HashKey Chain.\n' +
      'Wallet: ' + wallet + '\n' +
      'HSK Balance: ' + balanceHSK + ' HSK\n' +
      'HSK Price: ' + hskPrice + ' (24h change: ' + hskChange + ')\n' +
      'Suggest a portfolio rebalancing strategy in 3 bullet points.\n' +
      'Be specific: percentages, protocols, and rationale. Keep it concise.';

    const analysis = await askAI(prompt);

    const reply =
      'Portfolio Rebalance Report:\n' +
      'Address: ' + wallet + '\n' +
      'HSK Balance: ' + balanceHSK + ' HSK\n' +
      'HSK Price: ' + hskPrice + ' | 24h: ' + hskChange + '\n\n' +
      'AI Rebalance Strategy:\n' + analysis;

    logAction(wallet, 'rebalance', reply);
    return { reply };
  } catch (err) {
    return { reply: 'Rebalance error: ' + err.message };
  }
}

module.exports = { run };
