const hre = require("hardhat");

async function main() {
  const { ethers } = hre;

  // Hardcoded dummy Merkle root (must be 32 bytes = 66 characters)
  const hardcodedRoot = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const description = "Initial Merkle Tree Batch";

  const RootSeal = await ethers.getContractFactory("RootSeal");
  const rootSeal = await RootSeal.deploy(hardcodedRoot, description);
  await rootSeal.waitForDeployment();

  console.log(`RootSeal deployed at: ${rootSeal.target}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
