# lottery-contract
Solidity contract example for lottery app

## Pre-Requisits
* Create an app on [infura](https://infura.io/) for example to be able to deploy your app on any ethereum network without the need to host a full node
* Rename `.env.example` to `.env`: remove ~~.example~~
* Inside `.env` reassign the following env variables
     - MNEMONIC_PHRASE="YOUR_WALLET_MNEMONIC_PHRASE_HERE"
     - ETHEREUM_NODE_URL="LINK_TO_ETHEREUM_NODE_API_TO_DEPLOY_YOUR_CONTRACT"

## Available scripts
* `npm run test` runs all test cases from test folder
* `npm run deploy` deploy solidity contract in folder contracts
