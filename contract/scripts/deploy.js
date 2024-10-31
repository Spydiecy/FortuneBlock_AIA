const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment of FortuneBlock...");

    // Get the deployer's signer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance));

    // Deploy FortuneBlock
    const FortuneBlock = await hre.ethers.getContractFactory("FortuneBlock", deployer);
    console.log("Deploying contract...");
    const fortuneBlock = await FortuneBlock.deploy();

    await fortuneBlock.waitForDeployment();
    const contractAddress = await fortuneBlock.getAddress();

    console.log("FortuneBlock deployed to:", contractAddress);
    
    // Wait for block confirmations
    console.log("Waiting for block confirmations...");
    await fortuneBlock.deploymentTransaction().wait(5);
    console.log("Deployment confirmed!");

    // Verify contract
    try {
      console.log("Verifying contract...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: []
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }

  } catch (error) {
    console.error("Deployment error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });