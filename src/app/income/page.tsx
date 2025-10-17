'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export default function IncomeDetails() {
  const [isClient, setIsClient] = useState(false);

  const animateCounters = useCallback(() => {
    if (!isClient) return;

    const counters = document.querySelectorAll('.counter-animation');
    counters.forEach(counter => {
      const element = counter as HTMLElement;
      if (!element) return;

      const target = parseFloat(element.textContent?.replace(/[$,]/g, '') || '0');
      const increment = target / 100;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        if (element.textContent?.includes('$')) {
          element.textContent = '$' + current.toFixed(2);
        } else {
          element.textContent = Math.floor(current).toString();
        }
      }, 20);
    });
  }, [isClient]);

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

    // Animate counters
    const timer = setTimeout(() => {
      animateCounters();
    }, 1000);

    return () => clearTimeout(timer);
  }, [animateCounters]);

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
            <h1 className="text-xl font-bold orbitron gradient-text">Income Details</h1>
            <p className="text-gray-400 text-xs">Level + Global Pool</p>
          </div>
          <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
            <i className="fas fa-bell text-cyan-400"></i>
          </button>
        </div>
      </header>

      {/* Header Summary Card */}
      <section className="px-4 py-6">
        <div className="glass-card rounded-2xl p-6 neon-border slide-in">
          <div className="text-center mb-6">
            <div className="floating mb-4">
              <div className="w-16 h-16 mx-auto rounded-full earnings-card flex items-center justify-center pulse-glow">
                <i className="fas fa-coins text-2xl gradient-text"></i>
              </div>
            </div>
            <h2 className="text-2xl font-bold orbitron gradient-text mb-2">Total Earnings</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-4"></div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white counter-animation">$2,847.50</div>
              <p className="text-gray-400 text-xs">Total Earned</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400 counter-animation">$1,950.00</div>
              <p className="text-gray-400 text-xs">Total Claimed</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cyan-400 counter-animation">$897.50</div>
              <p className="text-gray-400 text-xs">Available</p>
            </div>
          </div>

          <button className="w-full claim-button text-black font-bold py-4 px-6 rounded-xl orbitron text-lg">
            <i className="fas fa-download mr-2"></i>
            Claim All ($897.50)
          </button>
        </div>
      </section>

      {/* Level Income Section */}
      <section className="px-4 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-3">
              <i className="fas fa-layer-group text-blue-400 text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-white orbitron">Level Income</h2>
          </div>

          <div className="glass-card rounded-2xl p-4">
            {/* Level Income Table Header */}
            <div className="grid grid-cols-5 gap-2 mb-4 pb-3 border-b border-gray-700/50">
              <div className="text-gray-400 text-xs font-medium">Level</div>
              <div className="text-gray-400 text-xs font-medium text-center">Share</div>
              <div className="text-gray-400 text-xs font-medium text-right">Earned</div>
              <div className="text-gray-400 text-xs font-medium text-right">Available</div>
              <div className="text-gray-400 text-xs font-medium text-center">Action</div>
            </div>

            {/* Level Rows */}
            <div className="space-y-2">
              {[
                { level: 'L1', share: '10%', earned: '$485.20', available: '$125.50', color: 'green' },
                { level: 'L2', share: '8%', earned: '$324.80', available: '$89.20', color: 'blue' },
                { level: 'L3', share: '6%', earned: '$243.60', available: '$67.40', color: 'purple' },
                { level: 'L4', share: '5%', earned: '$203.00', available: '$54.80', color: 'orange' },
                { level: 'L5', share: '4%', earned: '$162.40', available: '$43.60', color: 'red' },
                { level: 'L6', share: '3%', earned: '$121.80', available: '$32.70', color: 'teal' },
                { level: 'L7', share: '2%', earned: '$81.20', available: '$21.80', color: 'pink' },
                { level: 'L8', share: '1.5%', earned: '$60.90', available: '$16.40', color: 'indigo' },
                { level: 'L9', share: '1%', earned: '$40.60', available: '$10.90', color: 'yellow' },
                { level: 'L10', share: '0.5%', earned: '$20.30', available: '$5.50', color: 'gray' },
              ].map((item, index) => (
                <div key={index} className="level-row grid grid-cols-5 gap-2 py-3 px-2 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 flex items-center justify-center mr-2`}>
                      <span className={`text-xs font-bold text-${item.color}-400`}>{item.level}</span>
                    </div>
                  </div>
                  <div className="text-center text-white text-sm">{item.share}</div>
                  <div className="text-right text-white text-sm font-medium">{item.earned}</div>
                  <div className="text-right text-cyan-400 text-sm font-medium">{item.available}</div>
                  <div className="text-center">
                    <button className="mini-claim-btn text-black text-xs font-bold py-1 px-3 rounded-md">
                      Claim
                    </button>
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
          <Link href="/income" className="flex flex-col items-center space-y-1 text-cyan-400">
            <i className="fas fa-chart-line text-lg"></i>
            <span className="text-xs">Income</span>
          </Link>
          <Link href="/referrals" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
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