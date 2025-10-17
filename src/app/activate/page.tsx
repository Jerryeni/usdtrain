"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@/lib/wallet";
import { useActivateAccount } from "@/lib/hooks/useActivateAccount";
import { useToast } from "@/components/ui/use-toast";
import { Contract } from "ethers";
import { ADDRESSES } from "@/lib/contracts/addresses";

const USDT_ABI = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
];

export default function ActivatePage() {
  const { signer, address, connect, isConnecting } = useWallet();
  const { toast } = useToast();
  const [usdtBalance, setUsdtBalance] = useState<null | number>(null);
  const [, setDecimals] = useState(18);
  const [loading, setLoading] = useState(false);

  const activateMutation = useActivateAccount();

  // Fetch USDT balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!signer || !address) {
        setUsdtBalance(null);
        return;
      }
      // Only allow valid hex addresses (no ENS, no empty, no null)
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        setUsdtBalance(null);
        toast({
          title: "Invalid Wallet Address",
          description: "ENS names are not supported on BSC. Please connect with a valid hexadecimal address.",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      try {
        const usdt = new Contract(ADDRESSES.USDT, USDT_ABI, signer);
        const bal = await usdt.balanceOf(address);
        const dec = await usdt.decimals();
        setDecimals(Number(dec));
        setUsdtBalance(Number(bal) / 10 ** Number(dec));
      } catch (e) {
        setUsdtBalance(null);
        const err = e as { code?: string; operation?: string; message?: string };
        toast({
          title: "Error fetching USDT balance",
          description:
            err.code === "UNSUPPORTED_OPERATION" && err.operation === "getEnsAddress"
              ? "ENS names are not supported on BSC. Please ensure your wallet address is a valid hexadecimal address."
              : err.message || String(e),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, [signer, address, toast]);

  const handleActivate = async () => {
    activateMutation.mutate();
  };

  const minRequired = 10;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white/10 rounded-xl shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-4">Activate Your Account</h1>
      {!address ? (
        <button
          className="w-full py-3 bg-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
          onClick={connect}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <>
          <div className="mb-4">
            <div>
              <span className="font-semibold">USDT Balance:</span>{" "}
              {loading
                ? "Loading..."
                : usdtBalance !== null
                ? `$${usdtBalance.toFixed(2)}`
                : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Minimum Required:</span> $10.00 USDT
            </div>
          </div>
          <button
            className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
              usdtBalance !== null && usdtBalance >= minRequired
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={handleActivate}
            disabled={
              usdtBalance === null ||
              usdtBalance < minRequired ||
              activateMutation.isPending
            }
          >
            {activateMutation.isPending
              ? "Activating..."
              : usdtBalance !== null && usdtBalance >= minRequired
              ? "Activate Account"
              : "Deposit at least $10 USDT to Activate"}
          </button>
        </>
      )}
    </div>
  );
}