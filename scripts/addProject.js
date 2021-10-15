// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const hre = require("hardhat");

let owner;
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const deployedAdd = "0x1BA35ca41455F92684f847A36eF9b2F1FC647Df7";
  const add1 = "0x20eC965f19Ec9458f2ca9E1b0c95514be03AB71f";
  const factory = await ethers.getContractAt("IDOFactory", deployedAdd);
  const token = await ethers.getContractAt(
    "Token",
    "0x86Cc26d640A65EA19EC48Ce978A828b02b81982a"
  );
  const IdoMainInfo = {
    tokenAddress: token.address,
    whitelistedAddresses: [add1],
    tokenPriceInWei: "1000000000000000", //0.001ether per token
    hardCapInWei: "1000000000000000000", //1 ether max
    softCapInWei: "1000000000000000000", //1 ether min
    maxInvestInWei: "250000000000000000", //0.25 ether max
    minInvestInWei: "250000000000000000", //0.25 min
    openTime: 1634016900,
    closeTime: 1634182157,
    decimals: 18,
  };

  const Links = {
    saleTitle: ethers.utils.formatBytes32String("First Sale"),
    linkTelegram: ethers.utils.formatBytes32String("First Sale"),
    linkDiscord: ethers.utils.formatBytes32String("First Sale"),
    linkTwitter: ethers.utils.formatBytes32String("First Sale"),
    linkWebsite: ethers.utils.formatBytes32String("First Sale"),
  };
  console.log(await token.allowance(add1, deployedAdd));

  const addIdo = await factory.createPresale(IdoMainInfo, Links, {
    value: "10000000000000000",
    gasLimit: 5000000,
  });
  const addEvents = await addIdo.wait();
  // const newIDO = await ethers.getContractAt(
  //   "IDOFactory",
  //   addEvents.events[2].args.idoAddress
  // );
  //console.log(addEvents.events[2].args.idoAddress);
  // console.log((await token.balanceOf(newIDO.address)).toString());
  // await newIDO.connect(signer1).invest({ value: "250000000000000000" });
  // await newIDO.connect(signer2).invest({ value: "250000000000000000" });
  // await newIDO.connect(signer3).invest({ value: "250000000000000000" });
  // await newIDO.connect(signer4).invest({ value: "250000000000000000" });
  // await newIDO.connect(signer1).claimTokens();
  // await newIDO.connect(signer2).claimTokens();
  // await newIDO.connect(signer3).claimTokens();
  // await newIDO.connect(signer4).claimTokens();
  // console.log(await newIDO.getInvestors());
  // await newIDO.connect(owner).collectFundsRaised();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
