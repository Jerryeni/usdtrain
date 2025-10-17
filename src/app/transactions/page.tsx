'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Transactions() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

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
  }, []);

  const goBack = () => {
    window.history.back();
  };

  const transactions = [
    { type: 'claim', description: 'Claim Withdrawal', amount: '+$125.50', date: 'Dec 15, 2024 • 14:30', status: 'completed', icon: 'arrow-down', color: 'green' },
    { type: 'commission', description: 'Level 1 Commission', amount: '+$32.40', date: 'Dec 14, 2024 • 09:15', status: 'credited', icon: 'plus', color: 'blue' },
    { type: 'pool', description: 'Global Pool Share', amount: '+$45.80', date: 'Dec 13, 2024 • 23:59', status: 'credited', icon: 'globe', color: 'purple' },
    { type: 'commission', description: 'Level 2 Commission', amount: '+$18.90', date: 'Dec 13, 2024 • 16:22', status: 'credited', icon: 'users', color: 'orange' },
  ];

  return (
    <div className="relative z-10 min-h-screen">
      {/* Animated USDT Rain Background */}
      <div className="rain-animation" id="rain-container"></div>

      {/* Header with Navigation */}
      <header className="px-4 py-4 border-b border-gray-800/50 backdrop-blur-lg bg-black/20">
        <div className="flex items-center justify-between">
          <button onClick={goBack} className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
            <i className="fas fa-arrow-left text-cyan-400"></i>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold orbitron gradient-text">Transactions</h1>
            <p className="text-gray-400 text-xs">History & Records</p>
          </div>
          <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
            <i className="fas fa-filter text-cyan-400"></i>
          </button>
        </div>
      </header>

      {/* Transaction Summary */}
      <section className="px-4 py-6">
        <div className="glass-card rounded-2xl p-6 slide-in">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text orbitron">$2,847</div>
              <p className="text-gray-400 text-xs">Total Volume</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 orbitron">147</div>
              <p className="text-gray-400 text-xs">Transactions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 orbitron">$897</div>
              <p className="text-gray-400 text-xs">Pending</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction List */}
      <section className="px-4 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white orbitron">Recent Transactions</h2>
            <button className="text-cyan-400 text-sm">View All</button>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-xl bg-${transaction.color}-500/20 flex items-center justify-center mr-3`}>
                      <i className={`fas fa-${transaction.icon} text-${transaction.color}-400`}></i>
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-xs">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-${transaction.color}-400 font-semibold`}>{transaction.amount}</div>
                    <span className={`bg-${transaction.color}-500/20 text-${transaction.color}-400 text-xs px-2 py-1 rounded-full`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-gray-800/50 px-4 py-3">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/income" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <i className="fas fa-chart-line text-lg"></i>
            <span className="text-xs">Income</span>
          </Link>
          <Link href="/referrals" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <i className="fas fa-users text-lg"></i>
            <span className="text-xs">Team</span>
          </Link>
          <Link href="/transactions" className="flex flex-col items-center space-y-1 text-cyan-400">
            <i className="fas fa-exchange-alt text-lg"></i>
            <span className="text-xs">Transactions</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <i className="fas fa-user text-lg"></i>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}