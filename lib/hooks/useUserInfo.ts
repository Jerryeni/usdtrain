import { useQuery } from '@tanstack/react-query';
import { getReadContract } from '../contracts/USDTRain';
import { useWallet } from '../wallet';
import { UserInfo } from '../contracts/USDTRain';

/**
 * Hook to fetch user information from the USDTRain contract
 */
export function useUserInfo(userAddress?: string | null) {
  const { provider } = useWallet();

  return useQuery({
    queryKey: ['usdtrain', 'userInfo', userAddress],
    queryFn: async (): Promise<UserInfo | null> => {
      if (!userAddress || !provider) {
        return null;
      }

      try {
        const contract = getReadContract(provider);
        const result = await contract.getUserInfo(userAddress);

        return {
          userId: result[0],
          sponsorId: result[1],
          directReferrals: result[2],
          totalEarned: result[3],
          totalWithdrawn: result[4],
          isActive: result[5],
          activationTimestamp: result[6],
          nonWorkingClaimed: result[7],
          achieverLevel: result[8],
          userName: result[9],
          contactNumber: result[10],
        };
      } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
      }
    },
    enabled: !!userAddress && !!provider,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}