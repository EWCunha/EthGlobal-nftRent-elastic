# Elastic: An NFT Renting Protocol

## Summary 
Elastic is an NFT Renting Marketplace where listers can highlight the benefits gained from renting their NFT. The Dashboard tracks the progress of each rental and ensures a timely return.

## The Renting Protocol
The app uses a collaterailized deposit (the amount is decided upon by the rental lister) as insurance at the outset of each agreement. A rental lister also decide upon the amount of rent they would like to charge per day.

At the end of the timeperiod for a rental, if the renter does not pay the rental charge and does not return the NFT, the lister has the option of collecting the collateral deposit via their personalized dashboard within the app.

<p align="center">
<img src="https://user-images.githubusercontent.com/69436215/180620856-00943c06-7d96-4578-a801-cacb08777f80.png" width=70% height=70%>
<img src="https://user-images.githubusercontent.com/69436215/180621029-35d40758-152f-4898-bcf7-e25d5cca8fe5.png" width=70% height=70%>
</p>

## IPFS Incorperation
Upon the successful completion of a rental both the rentee and lister get a receipt from IPFS which can be used for accounting purposes.

## Running the dApp locally
To run the dApp locally, a Web3 Storage API token is needed. Follow [these instructions](https://web3.storage/docs/how-tos/generate-api-token/) to create your own API token. After downloading this repository, create a JSON file named `.secret.json` inside the `frontend/src` folder. Copy and paste your created API token in the JSON with the key `"WEB3_STORAGE_API_TOKEN"`.

In the `frontend` folder, run:
```
npm install
npm start
```
Have fun!

## Live dApp!
You can also check the live dApp deployed on Netlify, [here]().

## Used languages, frameworks, and tools
<div style="background-color: gray;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg" width="40" height="40" />  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" width="40" height="40" />          
</div>

- [ethers.js](https://docs.ethers.io/v5/)
- [IPFS](https://ipfs.io/)
- [Metamask](https://metamask.io/)
- [Web3 Storage](https://web3.storage/)
- [Hardhat](https://hardhat.org/)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Remix](https://remix.ethereum.org/)

## Team
- @kitfud
- @EWCunha
- @GZRdev
- @svarog-g
- @joshualyguessennd
