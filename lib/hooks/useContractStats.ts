import { useQuery } from '@tanstack/react-query';
import { getReadContract } from '../contracts/USDTRain';
import { useWallet } from '../wallet';
import { ContractStats } from '../contracts/USDTRain';

/**
 * Hook to fetch contract statistics from the USDTRain contract
 */
export function useContractStats() {
  const { provider } = useWallet();

  return useQuery({
    queryKey: ['usdtrain', 'contractStats'],
    queryFn: async (): Promise<ContractStats | null> => {
      if (!provider) {
        return null;
      }

      try {
        const contract = getReadContract(provider);
        const result = await contract.getContractStats();

        return {
          _totalUsers: result[0],
          _totalActivatedUsers: result[1],
          _globalPoolBalance: result[2],
          _totalDistributed: result[3],
          _eligibleUsersCount: result[4],
        };
      } catch (error) {
        console.error('Error fetching contract stats:', error);
        throw error;
      }
    },
    enabled: !!provider,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}