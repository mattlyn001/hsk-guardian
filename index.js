require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('frontend'));

const monitor = require('./plugins/monitor');
const risk = require('./plugins/risk');
const yieldPlugin = require('./plugins/yield');
const rebalance = require('./plugins/rebalance');

app.post('/agent', async (req, res) => {
  const { message, wallet } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const msg = message.toLowerCase();
  let result;

  try {
    if (msg.includes('monitor') || msg.includes('watch')) {
      result = await monitor.run(wallet);
    } else if (msg.includes('risk') || msg.includes('score')) {
      result = await risk.run(wallet);
    } else if (msg.includes('yield') || msg.includes('apy')) {
      result = await yieldPlugin.run();
    } else if (msg.includes('rebalance') || msg.includes('portfolio')) {
      result = await rebalance.run(wallet);
    } else {
      result = { reply: "HSK Guardian here. I can: monitor a wallet, check risk score, find best yield, or rebalance your portfolio. What would you like?" };
    }
  } catch (err) {
    result = { reply: 'Error: ' + err.message };
  }

  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HSK Guardian running on port ${PORT}`));
