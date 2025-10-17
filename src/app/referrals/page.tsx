'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Referrals() {
  useEffect(() => {

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
            <h1 className="text-xl font-bold orbitron gradient-text">My Referrals</h1>
            <p className="text-gray-400 text-xs">Team Management</p>
          </div>
          <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
            <i className="fas fa-plus text-cyan-400"></i>
          </button>
        </div>
      </header>

      {/* Team Overview */}
      <section className="px-4 py-6">
        <div className="glass-card rounded-2xl p-6 slide-in">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text orbitron counter-animation">127</div>
              <p className="text-gray-400 text-sm">Total Referrals</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text orbitron counter-animation">89</div>
              <p className="text-gray-400 text-sm">Active Members</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-400/20 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                  <i className="fas fa-chart-line text-green-400 text-sm"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Team Volume</h3>
                  <p className="text-gray-400 text-xs">This month</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold orbitron">$12,847</div>
                <div className="text-gray-400 text-xs">+15.2%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                  <i className="fas fa-users text-blue-400 text-sm"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold">New Joins</h3>
                  <p className="text-gray-400 text-xs">This week</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-400 font-bold orbitron">+18</div>
                <div className="text-gray-400 text-xs">members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Level Breakdown */}
      <section className="px-4 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-white orbitron mb-4">Level Breakdown</h2>

          <div className="space-y-3">
            {[
              { level: 'Level 1', members: 15, income: '$485.20', color: 'green' },
              { level: 'Level 2', members: 23, income: '$324.80', color: 'blue' },
              { level: 'Level 3', members: 31, income: '$243.60', color: 'purple' },
              { level: 'Level 4', members: 28, income: '$203.00', color: 'orange' },
              { level: 'Level 5', members: 19, income: '$162.40', color: 'red' },
              { level: 'Level 6', members: 11, income: '$121.80', color: 'teal' },
            ].map((item, index) => (
              <div key={index} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-500/20 flex items-center justify-center mr-3`}>
                      <span className={`text-${item.color}-400 font-bold text-sm`}>{item.level.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.level}</h3>
                      <p className="text-gray-400 text-xs">{item.members} active members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-${item.color}-400 font-bold`}>{item.income}</div>
                    <div className="text-gray-400 text-xs">earned</div>
                  </div>
                </div>
              </div>
            ))}
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
          <Link href="/referrals" className="flex flex-col items-center space-y-1 text-cyan-400">
            <i className="fas fa-users text-lg"></i>
            <span className="text-xs">Team</span>
          </Link>
          <Link href="/transactions" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
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