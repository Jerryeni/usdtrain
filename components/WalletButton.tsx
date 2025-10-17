"use client";

import React from 'react';
import { useWallet } from '../src/lib/wallet';

interface WalletButtonProps {
  className?: string;
  showAddress?: boolean;
  variant?: 'default' | 'compact' | 'icon';
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  className = '',
  showAddress = true,
  variant = 'default'
}) => {
  const { address, isConnecting, connect, disconnect, isInjected } = useWallet();

  const handleClick = async () => {
    if (address) {
      disconnect();
    } else {
      try {
        await connect();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
      }
    }
  };

  if (!isInjected) {
    return (
      <button
        className={`px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ${className}`}
        disabled
      >
        No Wallet Detected
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className={`w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all duration-200 ${className}`}
        title={address ? 'Disconnect wallet' : 'Connect wallet'}
      >
        {isConnecting ? (
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        ) : address ? (
          <div className="w-4 h-4 bg-green-400 rounded-full"></div>
        ) : (
          <i className="fas fa-wallet text-cyan-400 text-sm"></i>
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
          address
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            : isConnecting
              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
        } ${className}`}
      >
        {isConnecting ? (
          <span className="flex items-center">
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
            Connecting...
          </span>
        ) : address ? (
          showAddress ? `${address.slice(0, 6)}...${address.slice(-3)}` : 'Connected'
        ) : (
          'Connect'
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
        address
          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-400/30'
          : isConnecting
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
      } ${className}`}
    >
      {isConnecting ? (
        <span className="flex items-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Connecting...
        </span>
      ) : address ? (
        <span className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          {showAddress ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
        </span>
      ) : (
        <span className="flex items-center">
          <i className="fas fa-wallet mr-2"></i>
          Connect Wallet
        </span>
      )}
    </button>
  );
};