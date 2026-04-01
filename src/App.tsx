/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Timer, ExternalLink, Send, Minus, Maximize2, Move, EyeOff, Eye } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('trader_tamim_logged_in') === 'true';
  });
  const [keyInput, setKeyInput] = useState('');
  const [prediction, setPrediction] = useState('...');
  const [luckyNums, setLuckyNums] = useState('-- & --');
  const [seconds, setSeconds] = useState(30);
  const [predictColor, setPredictColor] = useState('#fff');

  const [navLocked, setNavLocked] = useState(() => {
    const saved = localStorage.getItem('trader_tamim_nav_locked');
    return saved === null ? true : saved === 'true';
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const [loginError, setLoginError] = useState('');

  const list = [
    "SMALL 1,3", 
    "SMALL 2,4", 
    "SMALL 0,4", 
    "BIG 6,8", 
    "BIG 7,9", 
    "BIG 5,9"
  ];

  useEffect(() => {
    localStorage.setItem('trader_tamim_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('trader_tamim_nav_locked', navLocked.toString());
  }, [navLocked]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const now = new Date();
      const ms = now.getTime();
      
      // Prediction Logic
      const p = Math.floor(ms / 30000);
      const seed = p * 1.234;
      const idx = Math.floor(Math.abs(Math.sin(seed) * list.length)) % list.length;
      
      const resultData = list[idx].split(' '); 
      const resultText = resultData[0];
      const nums = resultData[1];

      setPrediction(resultText);
      setPredictColor(resultText === "BIG" ? "#00ffff" : "#ff00ff");
      setLuckyNums(nums);

      // Timer Logic
      const totalSec = now.getSeconds();
      const remaining = totalSec >= 30 ? 60 - totalSec : 30 - totalSec;
      setSeconds(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (navLocked) {
      setLoginError("Unlock nav on homepage first!");
      return;
    }
    if (keyInput === "joyvai") {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError("WRONG KEY! Access Denied.");
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono">
      {/* Background Iframe with Navigation Restriction */}
      <div className="absolute inset-0 w-full h-full">
        <iframe 
          id="game-frame" 
          src="https://dkwin9.com/#/register?invitationCode=62371643494" 
          className="w-full h-full border-none"
          title="Game Registration"
          sandbox="allow-scripts allow-forms allow-same-origin"
        />
        
        {/* Navigation Blockers: Ensuring users stay on the registration form */}
        {navLocked && (
          <>
            {/* 1. Back Button Blocker (Top Left) */}
            <div 
              className="absolute top-0 left-0 w-[15%] h-[10%] bg-transparent cursor-default z-10"
              title="Navigation restricted"
            />

            {/* 2. Bottom Menu Blocker: Only covers the very bottom navigation bar */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[8%] bg-transparent cursor-default z-10"
              title="Navigation restricted - Please register first"
            />
          </>
        )}

        {/* 3. Logout Blocker (Persistent): Blocks the top right area where profile/logout usually is */}
        <div 
          className="absolute top-0 right-0 w-[20%] h-[10%] bg-transparent cursor-default z-20"
          title="Logout disabled"
        />
      </div>

      {/* Draggable Hacker Box */}
      {!isHidden ? (
        <motion.div 
          drag
          dragMomentum={false}
          initial={{ top: '15%', left: '50%', x: '-50%' }}
          animate={{ 
            width: isMinimized ? 150 : (isLarge ? 280 : 220),
            height: isMinimized ? 40 : 'auto',
            opacity: 1
          }}
          className="absolute z-50 bg-black rounded-lg p-2 text-center border-3 border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.5)] cursor-move select-none overflow-hidden"
          style={{
            animation: 'rgb-border-simple 5s linear infinite',
          }}
        >
          {/* Scan Line Animation */}
          {!isMinimized && <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00ff00] shadow-[0_0_20px_2px_#00ff00] pointer-events-none animate-scan-move" />}

          <div className="text-[11px] font-black tracking-wider text-white mb-2 pb-1 border-b border-white/20 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 truncate">
              <Shield className="w-2 h-2 text-red-500 shrink-0" />
              <span className="truncate">𝗧ʀᴀᴅᴇʀ 𝗧ᴀᴍɪᴍ</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setIsLarge(!isLarge)} className="hover:text-red-500 p-0.5">
                <Maximize2 className="w-2 h-2" />
              </button>
              <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-red-500 p-0.5">
                <Minus className="w-2 h-2" />
              </button>
              <button onClick={() => setIsHidden(true)} className="hover:text-red-500 p-0.5">
                <EyeOff className="w-2 h-2" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {!isLoggedIn ? (
                <div className="space-y-2 p-1">
                  <div className="text-[9px] text-yellow-400 uppercase mb-1">System Locked</div>
                  <input 
                    type="password" 
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="ENTER KEY"
                    className="w-full p-1.5 bg-[#111] border border-[#444] text-white text-center rounded text-[10px] outline-none focus:border-[#00ff00] transition-colors"
                  />
                  <button 
                    onClick={handleLogin}
                    className="w-full p-1.5 bg-[#00ff00] text-black font-black text-[9px] uppercase rounded cursor-pointer hover:bg-[#00cc00] transition-colors flex items-center justify-center gap-1"
                  >
                    <Zap className="w-2 h-2" />
                    START HACK
                  </button>
                  
                  {loginError && (
                    <p className="text-[8px] text-red-500 mt-1 font-bold animate-pulse">
                      {loginError}
                    </p>
                  )}
                  
                  <div className="pt-1 border-t border-white/10">
                    <button 
                      onClick={() => setNavLocked(!navLocked)}
                      className={`w-full p-1 text-[7px] font-black uppercase rounded border transition-all ${navLocked ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-green-500 text-green-500 bg-green-500/10'}`}
                    >
                      {navLocked ? 'NAV: LOCKED' : 'NAV: UNLOCKED'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-1">
                  <div className="bg-white/10 border border-white/20 p-2 rounded-md">
                    <div className="text-[8px] text-yellow-400 uppercase mb-1 flex items-center justify-center gap-1">
                      <ExternalLink className="w-2 h-2" />
                      PREDICTION
                    </div>
                    <div 
                      className={`${isLarge ? 'text-4xl' : 'text-2xl'} font-black leading-none my-1 transition-all duration-500`}
                      style={{ color: predictColor }}
                    >
                      {prediction}
                    </div>
                    <div className={`${isLarge ? 'text-lg' : 'text-sm'} font-bold text-[#00ff00]`}>
                      {luckyNums}
                    </div>
                  </div>

                  <div className="text-[10px] text-white flex items-center justify-center gap-1">
                    <Timer className="w-2 h-2 text-red-500" />
                    NEXT: <span className="text-red-500 font-bold">{seconds}</span>s
                  </div>
                  
                  {loginError && (
                    <p className="text-[8px] text-red-500 mt-1 font-bold">
                      {loginError}
                    </p>
                  )}

                  <div className="space-y-1">
                    <button 
                      onClick={() => setNavLocked(!navLocked)}
                      className={`w-full p-1 text-[8px] font-black uppercase rounded border transition-all ${navLocked ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-green-500 text-green-500 bg-green-500/10'}`}
                    >
                      {navLocked ? 'NAV: LOCKED' : 'NAV: UNLOCKED'}
                    </button>

                    <a 
                      href="https://t.me/dkwingiftcodefree4" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-1.5 bg-red-600 text-white text-[9px] font-black uppercase rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Send className="w-2 h-2" />
                      TELEGRAM
                    </a>
                  </div>
                </div>
              )}
              
              {/* Resize Handle Indicator */}
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-600/30 rounded-tl-full pointer-events-none" />
            </>
          )}
        </motion.div>
      ) : (
        <button 
          onClick={() => setIsHidden(false)}
          className="absolute top-4 right-4 z-50 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      <style>{`
        @keyframes rgb-border-simple {
          0% { border-color: #ff0000; box-shadow: 0 0 15px #ff0000; }
          20% { border-color: #ffff00; box-shadow: 0 0 15px #ffff00; }
          40% { border-color: #00ff00; box-shadow: 0 0 15px #00ff00; }
          60% { border-color: #00ffff; box-shadow: 0 0 15px #00ffff; }
          80% { border-color: #0000ff; box-shadow: 0 0 15px #0000ff; }
          100% { border-color: #ff00ff; box-shadow: 0 0 15px #ff00ff; }
        }

        .animate-scan-move {
          animation: scan-move 2s linear infinite;
        }

        @keyframes scan-move {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }

        /* Prevent context menu as requested by user's HTML */
        body {
          user-select: none;
        }
      `}</style>
    </div>
  );
}
