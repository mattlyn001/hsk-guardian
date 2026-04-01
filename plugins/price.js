require('dotenv').config();

async function getHSKPrice() {
  try {
    const res = await fetch(
      'https://api.coinpaprika.com/v1/tickers/hsk-hashkey-platform-token',
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();
    if (data && data.quotes && data.quotes.USD) {
      return {
        usd: data.quotes.USD.price,
        usd_24h_change: data.quotes.USD.percent_change_24h
      };
    }
  } catch (e) {}
  return null;
}

module.exports = { getHSKPrice };
