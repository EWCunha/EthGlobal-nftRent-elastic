require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
