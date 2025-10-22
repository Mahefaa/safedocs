async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const FileStorage = await ethers.getContractFactory("FileStorage");
  const fs = await FileStorage.deploy();
  await fs.waitForDeployment();

  console.log("Contract deployed to:", fs.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
