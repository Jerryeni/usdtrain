"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

// Type-safe interfaces for Web3 providers using ethers types
interface EthereumRequestParams {
  method: string;
  params?: readonly unknown[];
}

// Window interface extension for Web3 - using type assertion to avoid conflicts

type WalletState = {
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null;
  signer: ethers.Signer | null;
  address: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isInjected: boolean;
  isConnecting: boolean;
};

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isInjected = typeof window !== "undefined" && !!window.ethereum;

  useEffect(() => {
    // Initialize read-only RPC provider
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://bsc-testnet-dataseed.binance.org/';
    const rpcProvider = new ethers.JsonRpcProvider(rpcUrl);
    setProvider(rpcProvider);

    // If injected provider is available, set up event listeners
    if (isInjected && window.ethereum) {
      const injected = new ethers.BrowserProvider(window.ethereum);

      // Try to populate address if wallet is already connected
      injected.getSigner()
        .then(async s => {
          const addr = await s.getAddress();
          setSigner(s);
          setAddress(addr);
        })
        .catch(() => {
          // Not connected yet, that's fine
        });

      // Listen to account & chain changes via EIP-1193
      window.ethereum.on?.("accountsChanged", async (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          setAddress(null);
          setSigner(null);
        } else {
          setAddress(ethers.getAddress(accounts[0]));
          setSigner(await injected.getSigner());
        }
      });

      window.ethereum.on?.("chainChanged", (chainHex: string) => {
        const id = Number(chainHex);
        setChainId(id);
      });
    }
  }, [isInjected]);

  const connect = async () => {
    if (!isInjected || !window.ethereum) {
      throw new Error("No injected wallet found (MetaMask). Please install MetaMask to continue.");
    }

    setIsConnecting(true);
    try {
      const injected = new ethers.BrowserProvider(window.ethereum);

      // Request account access
      await injected.send("eth_requestAccounts", []);

      // Get signer and address (ethers v6 returns Promise<JsonRpcSigner>)
      const s = await injected.getSigner();
      const addr = await s.getAddress();
      const network = await injected.getNetwork();

      setProvider(injected);
      setSigner(s);
      setAddress(addr);
      setChainId(Number(network.chainId));

      console.log(`Connected to ${addr} on chain ${network.chainId}`);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    // For injected wallets we can't fully disconnect programmatically
    // Clear local references and reset to read-only provider
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setIsConnecting(false);

    // Reset to read-only RPC provider
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://bsc-testnet-dataseed.binance.org/';
    setProvider(new ethers.JsonRpcProvider(rpcUrl));
  };

  return (
    <WalletContext.Provider value={{
      provider,
      signer,
      address,
      chainId,
      connect,
      disconnect,
      isInjected,
      isConnecting
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};