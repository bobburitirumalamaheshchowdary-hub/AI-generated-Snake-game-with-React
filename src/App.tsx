/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black overflow-hidden font-sans relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <header className="relative z-10 p-8 flex justify-between items-end border-b border-white/5 backdrop-blur-sm bg-black/20">
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black italic tracking-tighter uppercase leading-none"
          >
            Neon <span className="text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]">Pulse</span>
          </motion.h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mt-1">Audio-Reactive Gaming Engine</p>
        </div>
        <div className="flex gap-8 text-[11px] uppercase tracking-widest text-white/30 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-fuchsia-500/60">Version</span>
            <span>2.0.4-LOCKED</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-cyan-500/60">Status</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> SYSTEM_ONLINE</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start h-[calc(100vh-140px)]">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-4 border-t border-white/5 bg-black/40 backdrop-blur-md z-10 flex justify-center">
        <div className="flex gap-12 text-[9px] uppercase tracking-[0.5em] text-white/20 font-bold">
          <span>Synthwave Aesthetic</span>
          <span className="text-cyan-500/40">•</span>
          <span>Zero-Latency Response</span>
          <span className="text-fuchsia-500/40">•</span>
          <span>Neuro-Link Active</span>
        </div>
      </footer>
    </div>
  );
}
