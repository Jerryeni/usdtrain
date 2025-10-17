'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile() {
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
            <h1 className="text-xl font-bold orbitron gradient-text">Profile</h1>
            <p className="text-gray-400 text-xs">Account Settings</p>
          </div>
          <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
            <i className="fas fa-edit text-cyan-400"></i>
          </button>
        </div>
      </header>

      {/* Profile Info */}
      <section className="px-4 py-6">
        <div className="glass-card rounded-2xl p-6 slide-in text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <Image
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
              alt="Profile"
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold text-white orbitron mb-1">John Doe</h2>
          <p className="text-gray-400 text-sm mb-2">Premium Member</p>
          <div className="text-sm text-cyan-400 font-mono">0xA4f...9B3</div>
          <div className="flex items-center justify-center mt-3">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-green-400 text-sm">Active</span>
          </div>
        </div>
      </section>

      {/* Account Stats */}
      <section className="px-4 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-white orbitron mb-4">Account Overview</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text orbitron">127</div>
              <p className="text-gray-400 text-xs">Total Referrals</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 orbitron">Level 7</div>
              <p className="text-gray-400 text-xs">Current Level</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 orbitron">$2,847</div>
              <p className="text-gray-400 text-xs">Total Earned</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 orbitron">89</div>
              <p className="text-gray-400 text-xs">Active Team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Options */}
      <section className="px-4 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-bold text-white orbitron mb-4">Settings</h2>

          <div className="space-y-3">
            {[
              { icon: 'wallet', title: 'Wallet Settings', desc: 'Manage withdrawal address' },
              { icon: 'bell', title: 'Notifications', desc: 'Payment & system alerts' },
              { icon: 'shield-alt', title: 'Security', desc: 'Two-factor authentication' },
              { icon: 'question-circle', title: 'Help & Support', desc: 'Get assistance' },
              { icon: 'sign-out-alt', title: 'Logout', desc: 'Sign out from account' },
            ].map((item, index) => (
              <div key={index} className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center mr-3">
                    <i className={`fas fa-${item.icon} text-cyan-400`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
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
          <Link href="/referrals" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <i className="fas fa-users text-lg"></i>
            <span className="text-xs">Team</span>
          </Link>
          <Link href="/transactions" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <i className="fas fa-exchange-alt text-lg"></i>
            <span className="text-xs">Transactions</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-cyan-400">
            <i className="fas fa-user text-lg"></i>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}