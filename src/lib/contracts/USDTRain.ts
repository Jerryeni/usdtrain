import { ethers } from 'ethers';
import USDTRainABI from './abi/USDTRain.json';

// Contract address - update this with your deployed contract address
export const USDTRAIN_CONTRACT_ADDRESS = (() => {
  const addr = process.env.NEXT_PUBLIC_USDTRAIN_CONTRACT_ADDRESS;
  if (!addr) throw new Error('Missing required environment variable: NEXT_PUBLIC_USDTRAIN_CONTRACT_ADDRESS');
  return addr;
})();

/**
 * Get a read-only contract instance for view functions
 */
export function getReadContract(provider: ethers.Provider | null): ethers.Contract {
  if (!provider) {
    throw new Error('Provider is required for read operations');
  }
  return new ethers.Contract(USDTRAIN_CONTRACT_ADDRESS, USDTRainABI, provider);
}

/**
 * Get a write contract instance for state-changing functions
 */
export function getWriteContract(signer: ethers.Signer | null): ethers.Contract {
  if (!signer) {
    throw new Error('Signer is required for write operations');
  }
  return new ethers.Contract(USDTRAIN_CONTRACT_ADDRESS, USDTRainABI, signer);
}

// Type definitions for contract return types
export interface UserInfo {
  userId: bigint;
  sponsorId: bigint;
  directReferrals: bigint;
  totalEarned: bigint;
  totalWithdrawn: bigint;
  isActive: boolean;
  activationTimestamp: bigint;
  nonWorkingClaimed: bigint;
  achieverLevel: bigint;
  userName: string;
  contactNumber: string;
}

export interface ContractStats {
  _totalUsers: bigint;
  _totalActivatedUsers: bigint;
  _globalPoolBalance: bigint;
  _totalDistributed: bigint;
  _eligibleUsersCount: bigint;
}

export interface AchieverProgress {
  currentLevel: bigint;
  currentDirect: bigint;
  nextLevelRequirement: bigint;
  progressPercentage: bigint;
}

// Event type definitions
export interface UserRegisteredEvent {
  userId: bigint;
  userAddress: string;
  sponsorId: bigint;
}

export interface UserActivatedEvent {
  userId: bigint;
  userAddress: string;
}

export interface LevelIncomePaidEvent {
  userId: bigint;
  level: bigint;
  amount: bigint;
}

export interface ProfileUpdatedEvent {
  userId: bigint;
  userAddress: string;
  userName: string;
  contactNumber: string;
}