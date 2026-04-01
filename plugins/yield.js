require('dotenv').config();
const { getHSKPrice } = require('./price');
const { logAction } = require('./logger');

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

async function run() {
  try {
    const hskData = await getHSKPrice();
    const hskPrice = hskData ? '$' + hskData.usd.toFixed(4) : 'unavailable';
    const hskChange = hskData ? hskData.usd_24h_change.toFixed(2) + '%' : 'N/A';

    const prompt =
      'You are a DeFi yield advisor. HSK token current price: ' + hskPrice + ' (24h change: ' + hskChange + ').\n' +
      'List the top 3 yield opportunities for HSK holders right now.\n' +
      'For each: Protocol name, estimated APY range, risk level (Low/Medium/High), and one sentence explanation.\n' +
      'Focus on staking, liquidity provision, and lending strategies.';

    const analysis = await askAI(prompt);

    const reply =
      'Yield Opportunities for HSK Holders:\n' +
      'HSK Price: ' + hskPrice + ' | 24h: ' + hskChange + '\n\n' +
      analysis;

    logAction(null, 'yield', reply);
    return { reply };
  } catch (err) {
    return { reply: 'Yield error: ' + err.message };
  }
}

module.exports = { run };
