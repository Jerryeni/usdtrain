import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getWriteContract } from '../contracts/USDTRain';
import { Contract } from "ethers";
import { useWallet } from '../wallet';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for activating user account in the USDTRain contract
 */
export function useActivateAccount() {
  const { signer } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ transactionHash: string }> => {
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      const contract = getWriteContract(signer);

      try {
        // 1. Fetch activation fee and USDT token address
        const activationFee = await contract.ACTIVATION_FEE();
        const usdtTokenAddress = await contract.usdtToken();

        // 2. Create USDT contract instance
        const usdtAbi = [
          "function approve(address spender, uint256 amount) public returns (bool)",
          "function allowance(address owner, address spender) public view returns (uint256)",
          "function balanceOf(address owner) public view returns (uint256)",
          "function decimals() public view returns (uint8)"
        ];
        if (!contract.runner) {
          throw new Error("Contract runner is not available");
        }
        const usdt = new Contract(usdtTokenAddress, usdtAbi, signer);

        // 3. Check user USDT balance
        const userAddress = await signer.getAddress();
        const balance = await usdt.balanceOf(userAddress);
        if (balance < activationFee) {
          throw new Error(`Insufficient USDT balance. You need at least ${activationFee.toString()} USDT to activate your account.`);
        }

        // 4. Check allowance
        const allowance = await usdt.allowance(userAddress, contract.target);
        if (allowance < activationFee) {
          // Approve contract to spend USDT
          const approveTx = await usdt.approve(contract.target, activationFee);
          console.log('USDT approve tx sent:', approveTx.hash);
          await approveTx.wait();
          console.log('USDT approved for activation fee');
        }

        // 5. Estimate gas for activation
        let gasEstimate;
        try {
          gasEstimate = await contract.activateAccount.estimateGas();
          console.log('Activation gas estimate:', gasEstimate.toString());
        } catch (error) {
          console.warn('Gas estimation failed for activation:', error);
        }

        // 6. Send activation transaction
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
    onError: (error: unknown) => {
        console.error('Account activation error:', error);
        toast({
            title: "Account Activation Failed",
            description: (error as Error)?.message || String(error),
            variant: "destructive",
        });
    },
  });
}