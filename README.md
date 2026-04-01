# HSK Guardian

> AI powered DeFi agent on HashKey Chain it monitors wallets, scores risk, finds yield, and rebalances portfolios autonomously.

## Live Deployment

| | |
|---|---|
| Network | HashKey Chain Testnet (Chain ID: 133) |
| Contract | HSKGuardian.sol |
| Address | 0x75C883d31193E2f53325a6E0b132Ba5C0b984F9f |
| Explorer | https://testnet-explorer.hsk.xyz/address/0x75C883d31193E2f53325a6E0b132Ba5C0b984F9f |

## What It Does

HSK Guardian is an AI agent that connects to HashKey Chain and provides four autonomous DeFi capabilities:

| Capability | Description |
|---|---|
| Wallet Monitor | Reads live balance, transaction count, and block data from HashKey Chain |
| Risk Score | Analyzes wallet history using AI and returns a risk score from 1-100 |
| Yield Optimizer | Fetches live HSK price and recommends top yield strategies with APY ranges |
| Portfolio Rebalancer | Reads wallet holdings and generates AI-powered rebalancing strategies |

Every action is automatically recorded on-chain via the HSKGuardian smart contract, providing full auditability and transparency.

## Architecture

```
User (Chat UI — frontend/index.html)
        |
        v
HSK Guardian Agent (Node.js + Express — index.js)
        |
        |-- plugins/monitor.js    --> HashKey Chain RPC
        |-- plugins/risk.js       --> HashKey Chain RPC + OpenRouter AI
        |-- plugins/yield.js      --> CoinPaprika API + OpenRouter AI
        |-- plugins/rebalance.js  --> HashKey Chain RPC + CoinPaprika + OpenRouter AI
        |-- plugins/logger.js     --> HSKGuardian.sol (on-chain action logging)
        |-- plugins/price.js      --> CoinPaprika API (live HSK price)
        |
        v
HSKGuardian.sol — HashKey Chain Testnet
0x75C883d31193E2f53325a6E0b132Ba5C0b984F9f
```

## How It Works

1. User pastes their HashKey Chain wallet address in the chat UI
2. User sends a natural language message (monitor, risk, yield, or rebalance)
3. Agent reads live on-chain data from HashKey Chain via ethers.js
4. Agent fetches live HSK price from CoinPaprika API
5. OpenRouter AI analyzes the data and generates intelligent recommendations
6. The action and result are logged on-chain via HSKGuardian.sol

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v25 + Express |
| Blockchain | HashKey Chain Testnet (EVM, Chain ID: 133) |
| Chain Interaction | ethers.js v6 |
| Smart Contract | Solidity ^0.8.20 |
| AI Model | OpenRouter (openrouter/free) |
| Price Data | CoinPaprika API (no key required) |
| Frontend | HTML + CSS + Vanilla JS |

## Setup

```bash
git clone https://github.com/mattlyn001/hsk-guardian
cd hsk-guardian
npm install
cp .env.example .env
npm start
```

Open http://localhost:3000 in your browser.

## Environment Variables

```
OPENROUTER_API_KEY=your_openrouter_api_key
HSK_RPC_URL=https://testnet.hsk.xyz
HSK_CHAIN_ID=133
HSK_EXPLORER=https://testnet-explorer.hsk.xyz
PORT=3000
DEPLOYER_PRIVATE_KEY=your_wallet_private_key
```

## Usage

Paste your HashKey Chain wallet address in the UI, then ask:

- "Monitor my wallet" — get live balance and transaction data
- "Check my risk score" — get AI-powered risk analysis
- "Find best yield" — get top APY opportunities for HSK holders
- "Rebalance my portfolio" — get AI-generated rebalancing strategy

## Smart Contract

HSKGuardian.sol logs every agent action on-chain:

```solidity
function recordAction(
    address wallet,
    string calldata actionType,
    string calldata result
) external
```

Each log stores: wallet address, action type, result summary, and timestamp.

## Network Info

| | |
|---|---|
| RPC | https://testnet.hsk.xyz |
| Chain ID | 133 |
| Currency | HSK |
| Explorer | https://testnet-explorer.hsk.xyz |

## Hackathon

| | |
|---|---|
| Event | HashKey Chain On-Chain Horizon Hackathon |
| Track | AI Track |
| Prize Pool | $40,000 USDT |
| Deadline | April 23, 2026 |
| DoraHacks | https://dorahacks.io/hackathon/2045 |
