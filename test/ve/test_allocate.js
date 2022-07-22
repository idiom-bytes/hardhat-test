const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

  const Web3 = require('web3');
  
  describe("veAllocate", function () {
    // setup fixture
    async function deployVeAllocate() {
      const [owner, account] = await ethers.getSigners();

      // Load Providers
      const provider = new ethers.providers.JsonRpcProvider();
      const web3 = new Web3(provider);

      // Deploy veAllocate
      const veAllocateFactory = await ethers.getContractFactory("veAllocate", account);
      const veAllocate = await veAllocateFactory.deploy();

      return { veAllocate, owner, account };
    }
  
    describe("Allocate", function () {
      it("Should allocate to contract", async function () {
        const { veAllocate, owner, account } = await loadFixture(deployVeAllocate);
  
        // allocate to test
        let result = await veAllocate.allocate(100, "test", {from: account.address})
        let allocation = await veAllocate.totalAllocation(account.address)        
        expect(allocation[0]).to.equal(100)
        expect(allocation[1][0]).to.equal("test")
        expect(allocation[2][0]).to.equal(100)
        
        // allocate to test2
        result = await veAllocate.allocate(25, "test2", {from: account.address})
        allocation = await veAllocate.totalAllocation(account.address)
        expect(allocation[0]).to.equal(125)
        expect(allocation[1][1]).to.equal("test2")
        expect(allocation[2][1]).to.equal(25)
        
        // allocate to test3
        result = await veAllocate.allocate(50, "test3", {from: account.address})
        allocation = await veAllocate.totalAllocation(account.address)
        expect(allocation[0]).to.equal(175)
        expect(allocation[1][2]).to.equal("test3")
        expect(allocation[2][2]).to.equal(50)
        
        // remove allocation from test3
        result = await veAllocate.removeAllocation(50, "test3", {from: account.address})
        allocation = await veAllocate.totalAllocation(account.address)
        expect(allocation[0]).to.equal(125)
        expect(allocation[1][2]).to.equal("test3")
        expect(allocation[2][2]).to.equal(0)
      });
    });
})