// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

//const { ethers } = require("ethers");

const hre = require('hardhat')
let owner, signer1, signer2, signer3, signer4
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Factory = await hre.ethers.getContractFactory('IDOFactory')
  const Token = await hre.ethers.getContractFactory('IDT2')
  const factory = await Factory.deploy()
  const token = await Token.deploy()
  await token.deployed()
  await factory.deployed()
  ;[owner] = await ethers.getSigners()

  console.log('Factory deployed to:', factory.address)
  console.log('Token deployed to:', token.address)

  const IdoMainInfo = {
    tokenAddress: token.address,
    whitelistedAddresses: [
      owner.address,
      '0x94C4C1b0d9D6569a181811ec3D1B3c96DABFc494',
      '0x95F2C938a5Ee94816a1Ab3f094a39e39531a6D2E',
    ],
    tokenPriceInWei: '100000000000000000', //0.00001ether per token
    hardCapInWei: '10000000000000000000', //10 ether max
    softCapInWei: '3000000000000000000', //3 ether min
    maxInvestInWei: '500000000000000000', //0.5 ether max
    minInvestInWei: '25000000000000000', //0.025 min
    openTime: 1,
    closeTime: 1636254723, //3 days from now
  }

  await token
    .connect(owner)
    .increaseAllowance(factory.address, '100000000000000000000000000000')

  const addIdo = await factory.createPresale(IdoMainInfo, {
    value: '10000000000000000',
  })

  const addEvents = await addIdo.wait()
  const newIDO = await ethers.getContractAt(
    'IDOBase',
    addEvents.events[2].args.idoAddress,
  )
  console.log('new IDO deployed to', newIDO.address)
  console.log((await token.balanceOf(newIDO.address)).toString())
  await newIDO.connect(owner).invest({ value: '250000000000000000' })
  console.log(await newIDO.checkInvestment(owner.address))
  // await newIDO.connect(signer2).invest({ value: "250000000000000000" });
  // await newIDO.connect(signer3).invest({ value: "250000000000000000" });
  // await newIDO.connect(signer4).invest({ value: "250000000000000000" });
  // await newIDO.connect(signer1).claimTokens();
  // await newIDO.connect(signer2).claimTokens();
  // await newIDO.connect(signer3).claimTokens();
  // await newIDO.connect(signer4).claimTokens();
  console.log(await newIDO.getInvestors())
  // await newIDO.connect(owner).collectFundsRaised();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
