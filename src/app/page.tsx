'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePresale } from '../../providers/provider';
import { isWalletAvailable } from '../../lib/web3/provider';

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [fontAwesomeLoaded, setFontAwesomeLoaded] = useState(false);
  const { userAddress, initWallet, uccInfo, userUCCInfo, isConnecting } = usePresale();

  const animateCounter = useCallback((elementId: string, targetValue: number, duration = 2000) => {
    if (!isClient) return;

    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }

      if (elementId === 'total-earnings') {
        element.textContent = '$' + currentValue.toFixed(2);
      } else {
        element.textContent = Math.floor(currentValue).toString();
      }
    }, 16);
  }, [isClient]);

  // Wallet installation handler
  const handleInstallWallet = () => {
    const walletUrl = 'https://metamask.io/download/';
    window.open(walletUrl, '_blank');
  };

  // Manual network switch handler
  const handleManualNetworkSwitch = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }], // BSC Testnet
        });
        console.log("Network Switched: Successfully switched to BSC Testnet");
      } catch (error: unknown) {
        console.error('Manual network switch failed:', error);
        console.error("Network Switch Failed: Please switch to BSC Testnet manually in your wallet");
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
    setFontAwesomeLoaded(true);

    // Create animated rain effect
    function createRain() {
      const rainContainer = document.getElementById('rain-container');
      if (!rainContainer) return;

      const symbols = ['₮', 'U', '$', '₮', 'T'];

      const interval = setInterval(() => {
        if (!rainContainer) return;

        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 3 + 5) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';

        rainContainer.appendChild(drop);

        setTimeout(() => {
          if (rainContainer?.contains(drop)) {
            rainContainer?.removeChild(drop);
          }
        }, 10000);
      }, 300);

      return () => clearInterval(interval);
    }

    createRain();

    // Animate counters with real data
    const timer = setTimeout(() => {
      const totalEarned = userUCCInfo?.usersInfo ?
        Number(userUCCInfo.usersInfo.totalTokens) / 1e18 : 1247.85;
      const referrals = userUCCInfo?.usersInfo ?
        Number(userUCCInfo.usersInfo.refCount) : 23;

      animateCounter('total-earnings', totalEarned);
      animateCounter('active-referrals', referrals);
    }, 500);

    return () => clearTimeout(timer);
  }, [userUCCInfo, animateCounter]);

  const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar?.classList.contains('-translate-x-full')) {
      sidebar.classList.remove('-translate-x-full');
      overlay?.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      sidebar?.classList.add('-translate-x-full');
      overlay?.classList.add('opacity-0', 'pointer-events-none');
    }
  };

  const handleWalletConnection = async () => {
    if (isConnecting || userAddress) return;

    try {
      console.log('Initiating wallet connection...');
      await initWallet();
      console.log('Wallet connection completed');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Error handling is done in the usePresale hook via toast notifications
    }
  };

  return (
    <div className="relative z-10 min-h-screen">
      {/* Animated USDT Rain Background */}
      <div className="rain-animation" id="rain-container"></div>

      {/* Header Section */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="slide-in">
          <button
            className="w-10 h-10 rounded-xl glass-card flex items-center justify-center"
            onClick={toggleSidebar}
          >
            {fontAwesomeLoaded ? (
              <i className="fas fa-bars text-cyan-400"></i>
            ) : (
              <div className="w-4 h-4 bg-cyan-400 rounded-sm"></div>
            )}
          </button>
        </div>

        <div className="slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center">
              {fontAwesomeLoaded ? (
                <i className="fas fa-coins text-green-400 text-sm"></i>
              ) : (
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              )}
            </div>
            <span className="text-white font-bold orbitron">USDT RAIN</span>
          </div>
        </div>

        <div className="slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs text-gray-400">Wallet</div>
              <div className="text-sm text-cyan-400 font-mono">
                {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-3)}` : 'Not Connected'}
              </div>
            </div>
            <button
              onClick={handleWalletConnection}
              disabled={isConnecting}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                userAddress
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : isConnecting
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
              }`}
            >
              {isConnecting ? (
                <span className="flex items-center">
                  {fontAwesomeLoaded ? (
                    <i className="fas fa-spinner fa-spin mr-1"></i>
                  ) : (
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                  )}
                  Connecting...
                </span>
              ) : userAddress ? (
                'Connected'
              ) : (
                'Connect'
              )}
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Wallet Installation Prompt */}
      {isClient && !isWalletAvailable() && (
        <section className="px-4 sm:px-6 mb-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-4 sm:p-6 slide-in">
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                {fontAwesomeLoaded ? (
                  <i className="fas fa-wallet text-2xl text-orange-400"></i>
                ) : (
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Web3 Wallet Required</h3>
              <p className="text-gray-300 mb-4">
                To use USDT RAIN, you need a Web3 wallet like MetaMask to connect to the blockchain.
              </p>
              <button
                onClick={handleInstallWallet}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Install MetaMask
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Earnings Card */}
      <section className="px-4 sm:px-6 mb-6">
        <div className={`earnings-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 slide-in ${!isWalletAvailable() || !userAddress ? 'opacity-50' : ''}`} style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-6">
            <div className="floating mb-4">
              <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center pulse-glow">
                {fontAwesomeLoaded ? (
                  <i className="fas fa-wallet text-xl sm:text-2xl gradient-text"></i>
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg"></div>
                )}
              </div>
            </div>
            <h2 className="text-base sm:text-lg text-gray-300 mb-2">Total Earnings</h2>
            <div className="text-3xl sm:text-4xl font-bold gradient-text orbitron counter-animation" id="total-earnings">
              {userUCCInfo?.usersInfo ?
                `$${(Number(userUCCInfo.usersInfo.totalTokens) / 1e18).toFixed(2)}` :
                '$1,247.85'
              }
            </div>
            <div className="text-sm text-cyan-400 mt-1">USDT</div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white counter-animation" id="active-referrals">
                {userUCCInfo?.usersInfo ?
                  Number(userUCCInfo.usersInfo.refCount) : 23
                }
              </div>
              <div className="text-xs text-gray-400">Active Referrals</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full pulse-glow ${userAddress ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className={`font-semibold text-sm ${userAddress ? 'text-green-400' : 'text-gray-400'}`}>
                  {userAddress ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Wallet Status</div>
            </div>
          </div>

          <Link href="/activate">
            <button
              className={`w-full glow-button text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl orbitron text-base sm:text-lg ${
                !userAddress ? 'animate-pulse' : ''
              }`}
            >
              {userAddress ? 'Activated' : 'Activate ID - $25 USDT'}
            </button>
          </Link>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section className="px-4 sm:px-6 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-white font-semibold mb-3">Presale Statistics</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold gradient-text orbitron counter-animation">
                ${uccInfo ? (uccInfo.totalInvestmentsUSDT / 1e18).toFixed(2) : 'Loading...'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Total Invested</div>
            </div>
            <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold gradient-text orbitron counter-animation">
                {uccInfo ? uccInfo.totalUsers : 'Loading...'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Total Users</div>
            </div>
            <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold gradient-text orbitron counter-animation">
                ${uccInfo ? (uccInfo.priceUSDT / 1e18).toFixed(4) : 'Loading...'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Token Price</div>
            </div>
          </div>

          {/* Network Status */}
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${userAddress ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <span className={userAddress ? 'text-green-400' : 'text-gray-400'}>
              {userAddress ? 'BSC Testnet Connected' : 'Wallet Not Connected'}
            </span>
            {userAddress && (
              <button
                onClick={handleManualNetworkSwitch}
                className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs hover:bg-cyan-500/30 transition-colors"
                title="Switch to BSC Testnet"
              >
                Switch Network
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions - Mobile Optimized */}
      <section className="px-4 sm:px-6 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="shortcut-grid">
            <Link href="/income">
              <div className="shortcut-item rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer">
                <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                  {fontAwesomeLoaded ? (
                    <i className="fas fa-chart-line text-blue-400"></i>
                  ) : (
                    <div className="w-6 h-6 bg-blue-400 rounded-lg"></div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-white font-medium text-xs sm:text-sm">Income Details</h4>
                  <p className="text-gray-400 text-xs mt-1">View breakdown</p>
                </div>
              </div>
            </Link>

            <Link href="/referrals">
              <div className="shortcut-item rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer">
                <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                  {fontAwesomeLoaded ? (
                    <i className="fas fa-users text-purple-400"></i>
                  ) : (
                    <div className="w-6 h-6 bg-purple-400 rounded-lg"></div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-white font-medium text-xs sm:text-sm">Referrals</h4>
                  <p className="text-gray-400 text-xs mt-1">Manage team</p>
                </div>
              </div>
            </Link>

            <Link href="/transactions">
              <div className="shortcut-item rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer">
                <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                  {fontAwesomeLoaded ? (
                    <i className="fas fa-exchange-alt text-green-400"></i>
                  ) : (
                    <div className="w-6 h-6 bg-green-400 rounded-lg"></div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-white font-medium text-xs sm:text-sm">Transactions</h4>
                  <p className="text-gray-400 text-xs mt-1">View history</p>
                </div>
              </div>
            </Link>

            <Link href="/share">
              <div className="shortcut-item rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer">
                <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                  {fontAwesomeLoaded ? (
                    <i className="fas fa-share-alt text-cyan-400"></i>
                  ) : (
                    <div className="w-6 h-6 bg-cyan-400 rounded-lg"></div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-white font-medium text-xs sm:text-sm">Share Link</h4>
                  <p className="text-gray-400 text-xs mt-1">Invite friends</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-20 border-t border-gray-800 px-4 py-3">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center space-y-1 text-cyan-400">
            {fontAwesomeLoaded ? (
              <i className="fas fa-home text-lg"></i>
            ) : (
              <div className="w-4 h-4 bg-cyan-400 rounded"></div>
            )}
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/income" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            {fontAwesomeLoaded ? (
              <i className="fas fa-chart-bar text-lg"></i>
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
            )}
            <span className="text-xs">Income</span>
          </Link>
          <Link href="/referrals" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            {fontAwesomeLoaded ? (
              <i className="fas fa-users text-lg"></i>
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
            )}
            <span className="text-xs">Team</span>
          </Link>
          <Link href="/transactions" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            {fontAwesomeLoaded ? (
              <i className="fas fa-exchange-alt text-lg"></i>
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
            )}
            <span className="text-xs">Transactions</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            {fontAwesomeLoaded ? (
              <i className="fas fa-user text-lg"></i>
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
            )}
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div id="sidebar" className="fixed top-0 left-0 w-80 h-full bg-black/95 backdrop-blur-20 border-r border-gray-800 transform -translate-x-full transition-transform duration-300 z-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center">
                {fontAwesomeLoaded ? (
                  <i className="fas fa-coins text-green-400"></i>
                ) : (
                  <div className="w-6 h-6 bg-green-400 rounded-lg"></div>
                )}
              </div>
              <span className="text-white font-bold orbitron">USDT RAIN</span>
            </div>
            <button onClick={toggleSidebar} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
              {fontAwesomeLoaded ? (
                <i className="fas fa-times text-cyan-400"></i>
              ) : (
                <div className="w-4 h-4 bg-cyan-400 rounded"></div>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <Link href="/" className="flex items-center space-x-3 p-3 rounded-xl bg-cyan-500/20 text-cyan-400 cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-home w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-cyan-400 rounded"></div>
              )}
              <span>Dashboard</span>
            </Link>
            <Link href="/wallet" className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-wallet w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              )}
              <span>Wallet</span>
            </Link>
            <Link href="/income" className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-chart-line w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              )}
              <span>Income Details</span>
            </Link>
            <Link href="/referrals" className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-users w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              )}
              <span>My Team</span>
            </Link>
            <Link href="/share" className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-share-alt w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              )}
              <span>Share & Earn</span>
            </Link>
            <Link href="/transactions" className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-history w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              )}
              <span>Transaction History</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-cog w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              )}
              <span>Settings</span>
            </Link>
            <Link href="/help" className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
              {fontAwesomeLoaded ? (
                <i className="fas fa-question-circle w-5"></i>
              ) : (
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              )}
              <span>Help & Support</span>
            </Link>
          </div>

          <div className="mt-8 p-4 glass-card rounded-xl">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">App Version</div>
              <div className="text-cyan-400 font-semibold">v2.1.0</div>
            </div>
          </div>

          {/* Wallet Status in Sidebar */}
          <div className="mt-4 p-4 glass-card rounded-xl">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Wallet Status</div>
              <div className={`text-sm font-semibold ${userAddress ? 'text-green-400' : 'text-gray-400'}`}>
                {userAddress ? 'Connected' : 'Not Connected'}
              </div>
              {userAddress && (
                <div className="text-xs text-cyan-400 font-mono mt-1">
                  {`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div
        id="sidebar-overlay"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 z-40"
        onClick={toggleSidebar}
      />
    </div>
  );
}
