import hre from "hardhat";

async function main() {
  const { ethers } = hre;

  // Take Merkle root + description from environment variables (or CLI args)
  const args = process.argv.slice(2);
  const merkleRoot = args[0] || "0x" + "0".repeat(64); // fallback dummy root
  const description = args[1] || "Default Merkle Tree Batch";

  // Deploy contract
  const RootSeal = await ethers.getContractFactory("RootSeal");
  const rootSeal = await RootSeal.deploy(merkleRoot, description);

  await rootSeal.waitForDeployment();

  console.log(`RootSeal deployed at: ${rootSeal.target}`);
  console.log(`Merkle Root: ${merkleRoot}`);
  console.log(`Description: ${description}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
