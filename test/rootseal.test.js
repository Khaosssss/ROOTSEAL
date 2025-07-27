const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RootSeal", function () {
  let RootSealFactory, rootSeal;
  let owner, otherUser;

  // Sample Merkle roots and descriptions
  const initialRoot = "0x" + "11".repeat(32);
  const initialDescription = "Initial Batch";

  const newRoot = "0x" + "22".repeat(32);
  const newDescription = "Updated Batch";

  beforeEach(async function () {
    [owner, otherUser] = await ethers.getSigners();

    RootSealFactory = await ethers.getContractFactory("RootSeal");
    rootSeal = await RootSealFactory.deploy(initialRoot, initialDescription);
    await rootSeal.waitForDeployment();
  });

  // Test that contract deploys with correct initial state
  it("should deploy with correct initial values", async function () {
    expect(await rootSeal.owner()).to.equal(owner.address);
    expect(await rootSeal.merkleRoot()).to.equal(initialRoot);
    expect(await rootSeal.description()).to.equal(initialDescription);
    expect(await rootSeal.isLocked()).to.equal(false);
  });

  // Only owner can update the root and description
  it("should allow owner to update Merkle root and description", async function () {
    await rootSeal.setMerkleRoot(newRoot, newDescription);
    expect(await rootSeal.merkleRoot()).to.equal(newRoot);
    expect(await rootSeal.description()).to.equal(newDescription);
  });

  // Ensure correct event is emitted on root update
  it("should emit MerkleRootUpdated event", async function () {
    await expect(rootSeal.setMerkleRoot(newRoot, newDescription))
      .to.emit(rootSeal, "MerkleRootUpdated")
      .withArgs(newRoot, newDescription);
  });

  // Prevent unauthorized users from updating the root
  it("should prevent non-owners from setting the Merkle root", async function () {
    await expect(
      rootSeal.connect(otherUser).setMerkleRoot(newRoot, newDescription)
    ).to.be.revertedWith("Not owner");
  });

  // Locking should change the locked state
  it("should allow owner to lock the contract", async function () {
    await rootSeal.lock();
    expect(await rootSeal.isLocked()).to.equal(true);
  });

  // Locking emits an event
  it("should emit ContractLocked event", async function () {
    await expect(rootSeal.lock()).to.emit(rootSeal, "ContractLocked");
  });

  // Updates should fail after contract is locked
  it("should prevent setting the root after locking", async function () {
    await rootSeal.lock();
    await expect(
      rootSeal.setMerkleRoot(newRoot, newDescription)
    ).to.be.revertedWith("Contract is locked");
  });

  // Contract should accept an empty string as description
  it("should allow setting an empty description", async function () {
    await rootSeal.setMerkleRoot(newRoot, "");
    expect(await rootSeal.description()).to.equal("");
  });

  // Should allow zeroed Merkle root if not explicitly blocked
  it("should allow setting a zero Merkle root", async function () {
    const zeroRoot = "0x" + "00".repeat(32);
    await rootSeal.setMerkleRoot(zeroRoot, "Zero Root");
    expect(await rootSeal.merkleRoot()).to.equal(zeroRoot);
  });

  // Prevent locking multiple times (if implemented)
  it("should revert if trying to lock when already locked", async function () {
    await rootSeal.lock();
    await expect(rootSeal.lock()).to.be.revertedWith("Already locked");
  });

  // Test with large description (checks for gas-heavy inputs)
  it("should accept a very long description", async function () {
    const longDescription = "a".repeat(1024);
    await rootSeal.setMerkleRoot(newRoot, longDescription);
    expect(await rootSeal.description()).to.equal(longDescription);
  });
});
