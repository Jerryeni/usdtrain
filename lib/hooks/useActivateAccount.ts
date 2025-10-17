import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getWriteContract } from '../contracts/USDTRain';
import { useWallet } from '../wallet';

/**
 * Hook for activating user account in the USDTRain contract
 */
export function useActivateAccount() {
  const { signer } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ transactionHash: string }> => {
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      const contract = getWriteContract(signer);

      try {
        // Estimate gas first
        let gasEstimate;
        try {
          gasEstimate = await contract.activateAccount.estimateGas();
          console.log('Activation gas estimate:', gasEstimate.toString());
        } catch (error) {
          console.warn('Gas estimation failed for activation:', error);
        }

        // Send transaction
        const tx = await contract.activateAccount(gasEstimate ? {
          gasLimit: gasEstimate * BigInt(12) / BigInt(10) // Add 20% buffer
        } : {});

        console.log('Activation transaction sent:', tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log('Activation confirmed:', receipt?.hash);

        return {
          transactionHash: tx.hash
        };
      } catch (error) {
        console.error('Account activation failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Account activated successfully:', data);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['usdtrain'] });
    },
    onError: (error) => {
      console.error('Account activation error:', error);
    },
  });
}