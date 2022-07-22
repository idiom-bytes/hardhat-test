const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

  const Web3 = require('web3');
  
  describe("veAllocate", function () {
    // setup fixture
    async function deployVeOCEAN() {
      const [owner, account] = await ethers.getSigners();

      // Load Providers
      const provider = new ethers.providers.JsonRpcProvider();
      const web3 = new Web3(provider);

      // Deploy OCEAN
      const SimpletokenFactory = await ethers.getContractFactory("Simpletoken", account);
      const OCEAN = await SimpletokenFactory.deploy("OCEAN", "Test OCEAN", 18, BigInt(1e21));

      // Deploy veOcean
      const veOCEANFactory = await ethers.getContractFactory("veOCEAN", account);
      const veOCEAN = await veOCEANFactory.deploy(OCEAN.address, "veOCEAN", "veOCEAN", "0.1");

      return { owner, account, OCEAN, veOCEAN };
    }
  
    describe("createLock", async function () {
      it("Should createLock with veOCEAN", async function () {
        const { owner, account, OCEAN, veOCEAN } = await loadFixture(deployVeOCEAN);

        // Load Providers
        const provider = new ethers.providers.JsonRpcProvider();
        const web3 = new Web3(provider);

        // Approve the lock for 10 OCEAN
        TA = BigInt(10.0)
        await OCEAN.approve(veOCEAN.address, TA)

        WEEK = 7 * 86400
        
        const latest = await time.latest()

        t0 = latest
        t1 = t0 // WEEK * WEEK + WEEK
        t2 = t1 + WEEK
        
        // Create the lock for 10 OCEAN
        tx = await veOCEAN.create_lock(BigInt(10.0), BigInt(t2))
        tx.wait()
        console.log("tx is: ", tx)
        // console.log("veOCEAN is: ", veOCEAN)
        
        votingPower = await veOCEAN.balanceOf(account.address, BigInt(t0))
        console.log("Voting power is: ", votingPower)
      });
    });
})