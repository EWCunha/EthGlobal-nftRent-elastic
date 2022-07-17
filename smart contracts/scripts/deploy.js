// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

async function main(deploy = true) {

  let elastic
  if (deploy) {
    const Elastic = await hre.ethers.getContractFactory("Elastic");
    elastic = await Elastic.deploy();

    await elastic.deployed();

    let trial = 1
    while (true) {
      try {
        await hre.run("verify:verify", {
          address: elastic.address,
          constructorArguments: [],
        });
        break
      } catch (e) {
        if (e.message.includes("Already Verified")) {
          break
        }
        console.log(`Trial ${trial}`)
        trial++
      }
    }
  } else {
    elastic = require("../../frontend/src/contracts/Elastic.json")
  }

  const elastic_json = require("../artifacts/contracts/Elastic.sol/Elastic.json")
  const agreement_json = require("../artifacts/contracts/Agreement.sol/Agreement.json")
  const agora_json = require("../artifacts/contracts/Agora.sol/Agora.json")
  const ierc721_json = require("../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json")

  const elastic_contract_obj = { address: elastic.address, abi: elastic_json.abi }
  const agreement_contract_obj = { address: "", abi: agreement_json.abi }
  const agora_contract_obj = { address: "", abi: agora_json.abi }
  const ierc721_obj = { address: "", abi: ierc721_json.abi }

  fs.writeFile("../frontend/src/contracts/Elastic.json", JSON.stringify(elastic_contract_obj), function (err) {
    if (err) throw err;
    console.log('complete Elastic');
  }
  )

  fs.writeFile("../frontend/src/contracts/Agreement.json", JSON.stringify(agreement_contract_obj), function (err) {
    if (err) throw err;
    console.log('complete Agreement');
  }
  )

  fs.writeFile("../frontend/src/contracts/Agora.json", JSON.stringify(agora_contract_obj), function (err) {
    if (err) throw err;
    console.log('complete Agora');
  }
  )

  fs.writeFile("../frontend/src/contracts/IERC721.json", JSON.stringify(ierc721_obj), function (err) {
    if (err) throw err;
    console.log('complete Agora');
  }
  )

  console.log("Deployed at:", elastic.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
