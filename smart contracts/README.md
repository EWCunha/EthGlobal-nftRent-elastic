# Elastic's Smart Contracts


The Elastic service is based on two main contracts, Elastic.sol and Agreement.sol that allow to list NFTs, rent NFTs and track the interactions between the listed NFTs, the owners, and the borrowers. These two smart contracts comprise the backend of Elastic dApp, which means that there is no centralized process or data storage in this project. The figure below illustrates the functionality of the smart contracts, then, following the figure, a brief explanation of what each contract does is given.
 
#### The Elastic contract
The Elastic contract is the exchange platform. It directs the NFT listings and the state of the NFTs listed, either available for rent, already borrowed or returned.
Through this contact an NFT owner can list their NFT for rent, with a collateral price and rental amount (the listing details can be modified afterwards). 
Anyone can review the NFTs listed and the renting details, and pick an NFT from the list to rent it after depositing the corresponding collateral ETH amount.
Note: the renter cannot rent their own NFT  

#### The Agreement contract  
If the borrower succesfully rents a listed NFT, an Agreement contract that sums up all the details of the transaction is generated. 
The agreement contract is evolutive: after the agreement contract is deployed, the defining elements of the contract (the rent duration, rental amount and collateral) can be modified upon agreement of both parties.

#### Payment Management
A third contract, Agora.sol, is available for later use. The Agora contract is designed to (virtually for now) equally distribute the service payments from the Elastic platform (a small percentage of the transactions occuring on the patform) between the platform owners and would serve as a decentralized decision/discussion place.
