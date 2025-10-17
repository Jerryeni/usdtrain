/**
 * USDTRain Contract Integration Test Script
 *
 * This script tests the contract integration with a local Hardhat network.
 * Run with: npx hardhat run scripts/test-contract-integration.js
 */

const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing USDTRain Contract Integration...");

  // Get the contract factory and deploy
  const USDTRain = await ethers.getContractFactory("USDTRain");

  // Deploy with test parameters
  const usdtTokenAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; // Test USDT on BSC
  const reserveWallet = "0x742d35Cc6635C0532C7F0b0bE5E5E2F5D8F7E7E"; // Test address

  const usdtrain = await USDTRain.deploy(usdtTokenAddress, reserveWallet);
  await usdtrain.waitForDeployment();

  const contractAddress = await usdtrain.getAddress();
  console.log("✅ Contract deployed to:", contractAddress);

  // Test contract functions
  console.log("\n📋 Testing contract functions...");

  // Test view functions
  const activationFee = await usdtrain.ACTIVATION_FEE();
  console.log("Activation Fee:", ethers.formatEther(activationFee));

  const totalUsers = await usdtrain.totalUsers();
  console.log("Total Users:", totalUsers.toString());

  const contractStats = await usdtrain.getContractStats();
  console.log("Contract Stats:", {
    totalUsers: contractStats[0].toString(),
    totalActivatedUsers: contractStats[1].toString(),
    globalPoolBalance: ethers.formatEther(contractStats[2]),
    totalDistributed: ethers.formatEther(contractStats[3]),
    eligibleUsersCount: contractStats[4].toString(),
  });

  // Test user registration
  console.log("\n👤 Testing user registration...");

  const [owner] = await ethers.getSigners();
  const sponsorId = 0; // No sponsor for first user

  try {
    const tx = await usdtrain.registerUser(sponsorId);
    await tx.wait();
    console.log("✅ User registered successfully");

    // Get user info
    const userInfo = await usdtrain.getUserInfo(owner.address);
    console.log("User Info:", {
      userId: userInfo[0].toString(),
      sponsorId: userInfo[1].toString(),
      directReferrals: userInfo[2].toString(),
      totalEarned: ethers.formatEther(userInfo[3]),
      isActive: userInfo[5],
      userName: userInfo[9],
      contactNumber: userInfo[10],
    });

  } catch (error) {
    console.error("❌ User registration failed:", error.message);
  }

  // Test event listeners
  console.log("\n🎧 Testing event listeners...");

  // Listen for UserRegistered event
  usdtrain.on("UserRegistered", (userId, userAddress, sponsorId) => {
    console.log("🎉 UserRegistered event caught:", {
      userId: userId.toString(),
      userAddress,
      sponsorId: sponsorId.toString(),
    });
  });

  console.log("✅ Event listeners set up");

  // Update environment file suggestion
  console.log("\n🔧 Update your .env.local file:");
  console.log(`NEXT_PUBLIC_USDTRAIN_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("NEXT_PUBLIC_RPC_URL=http://localhost:8545");
  console.log("NEXT_PUBLIC_CHAIN_ID=31337");

  console.log("\n🚀 Contract integration test completed!");
  console.log("You can now test the frontend with: npm run dev");
}

// Run the test
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });