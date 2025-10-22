require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "",
      accounts: [""]
    }
  },
  etherscan:{
      apiKey:{
          sepolia: ""
      }
  }
};
