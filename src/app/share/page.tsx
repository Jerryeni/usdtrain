'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Share() {
  const [referralLink] = useState('https://usdtrain.com/ref/0xA4f9B3');

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Join USDT RAIN and start earning! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const shareViaTelegram = () => {
    const message = `Join USDT RAIN and start earning! Use my referral link: ${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`);
  };

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
            <h1 className="text-xl font-bold orbitron gradient-text">Share & Earn</h1>
            <p className="text-gray-400 text-xs">Invite Friends</p>
          </div>
          <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
            <i className="fas fa-qrcode text-cyan-400"></i>
          </button>
        </div>
      </header>

      {/* Share Stats */}
      <section className="px-4 py-6">
        <div className="glass-card rounded-2xl p-6 slide-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-4">
              <i className="fas fa-share-alt text-2xl gradient-text"></i>
            </div>
            <h2 className="text-2xl font-bold orbitron gradient-text mb-2">Share & Earn</h2>
            <p className="text-gray-400">Invite friends and earn from their activity</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 orbitron">127</div>
              <p className="text-gray-400 text-xs">Total Referrals</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 orbitron">$485</div>
              <p className="text-gray-400 text-xs">Earned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 orbitron">89</div>
              <p className="text-gray-400 text-xs">Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Link */}
      <section className="px-4 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-white orbitron mb-4">Your Referral Link</h2>

          <div className="glass-card rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 mb-3">
              <span className="text-cyan-400 font-mono text-sm">{referralLink}</span>
              <button
                onClick={copyToClipboard}
                className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
              >
                <i className="fas fa-copy mr-1"></i>
                Copy
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={shareViaWhatsApp}
                className="flex-1 bg-green-500/20 text-green-400 py-3 px-4 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp
              </button>
              <button
                onClick={shareViaTelegram}
                className="flex-1 bg-blue-500/20 text-blue-400 py-3 px-4 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <i className="fab fa-telegram mr-2"></i>
                Telegram
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Breakdown */}
      <section className="px-4 mb-6">
        <div className="slide-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-bold text-white orbitron mb-4">Earnings Breakdown</h2>

          <div className="space-y-3">
            {[
              { level: 'Level 1', rate: '10%', earned: '$485.20', referrals: '15' },
              { level: 'Level 2', rate: '8%', earned: '$324.80', referrals: '23' },
              { level: 'Level 3', rate: '6%', earned: '$243.60', referrals: '31' },
            ].map((item, index) => (
              <div key={index} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{item.level}</h3>
                    <p className="text-gray-400 text-xs">{item.referrals} referrals • {item.rate} commission</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{item.earned}</div>
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
          <Link href="/referrals" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <i className="fas fa-users text-lg"></i>
            <span className="text-xs">Team</span>
          </Link>
          <Link href="/share" className="flex flex-col items-center space-y-1 text-cyan-400">
            <i className="fas fa-share-alt text-lg"></i>
            <span className="text-xs">Share</span>
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