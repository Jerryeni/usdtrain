import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useUserInfo } from '../useUserInfo';
import { useWallet } from '../../wallet';

// Mock the wallet context
jest.mock('../../wallet', () => ({
  useWallet: jest.fn(),
}));

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    Contract: jest.fn(),
    getAddress: jest.fn((addr) => addr),
  },
}));

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockContract = {
  getUserInfo: jest.fn(),
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useUserInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ethers.Contract as jest.Mock).mockReturnValue(mockContract);
  });

  it('should return null when no address is provided', () => {
    mockUseWallet.mockReturnValue({
      provider: {} as ethers.Provider,
      signer: null,
      address: null,
      chainId: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      isInjected: true,
      isConnecting: false,
    });

    const { result } = renderHook(() => useUserInfo(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should fetch user info successfully', async () => {
    const mockUserInfo = {
      userId: BigInt(123),
      sponsorId: BigInt(456),
      directReferrals: BigInt(5),
      totalEarned: BigInt(1000000000000000000), // 1 ETH in wei
      totalWithdrawn: BigInt(500000000000000000), // 0.5 ETH in wei
      isActive: true,
      activationTimestamp: BigInt(1700000000),
      nonWorkingClaimed: BigInt(100000000000000000),
      achieverLevel: BigInt(2),
      userName: 'Test User',
      contactNumber: '+1234567890',
    };

    mockContract.getUserInfo.mockResolvedValue([
      mockUserInfo.userId,
      mockUserInfo.sponsorId,
      mockUserInfo.directReferrals,
      mockUserInfo.totalEarned,
      mockUserInfo.totalWithdrawn,
      mockUserInfo.isActive,
      mockUserInfo.activationTimestamp,
      mockUserInfo.nonWorkingClaimed,
      mockUserInfo.achieverLevel,
      mockUserInfo.userName,
      mockUserInfo.contactNumber,
    ]);

    mockUseWallet.mockReturnValue({
      provider: {} as ethers.Provider,
      signer: null,
      address: '0x1234567890123456789012345678901234567890',
      chainId: 97,
      connect: jest.fn(),
      disconnect: jest.fn(),
      isInjected: true,
      isConnecting: false,
    });

    const { result } = renderHook(() => useUserInfo('0x1234567890123456789012345678901234567890'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUserInfo);
    expect(mockContract.getUserInfo).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890');
  });

  it('should handle errors gracefully', async () => {
    mockContract.getUserInfo.mockRejectedValue(new Error('Contract call failed'));

    mockUseWallet.mockReturnValue({
      provider: {} as ethers.Provider,
      signer: null,
      address: '0x1234567890123456789012345678901234567890',
      chainId: 97,
      connect: jest.fn(),
      disconnect: jest.fn(),
      isInjected: true,
      isConnecting: false,
    });

    const { result } = renderHook(() => useUserInfo('0x1234567890123456789012345678901234567890'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});