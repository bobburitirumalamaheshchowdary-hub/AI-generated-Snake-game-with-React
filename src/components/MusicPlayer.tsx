import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSeconds = (progress / 100) * currentTrack.duration;

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl p-6 flex flex-col gap-6 shadow-[0_0_50px_rgba(217,70,239,0.1)]">
      <div className="flex gap-4 items-center">
        <div className="relative w-20 h-20 group shrink-0">
          <div className="absolute -inset-1 bg-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="relative w-full h-full object-cover rounded-lg border border-white/10"
          />
          {isPlaying && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 p-2 h-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 6, 16, 4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-fuchsia-400 rounded-full"
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentTrack.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-lg font-bold text-white truncate"
            >
              {currentTrack.title}
            </motion.h3>
          </AnimatePresence>
          <motion.p
            key={`artist-${currentTrack.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="text-xs uppercase tracking-[0.2em] text-white/60 truncate"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-[0_0_10px_#d946ef]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <span>{formatTime(currentSeconds)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
          <Volume2 className="w-4 h-4" />
          <div className="w-12 h-1 bg-white/10 rounded-full">
            <div className="w-2/3 h-full bg-white/40 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-white/60 hover:text-fuchsia-400 transition-colors hover:scale-110 active:scale-95">
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black translate-x-0.5" />}
          </button>
          <button onClick={handleNext} className="text-white/60 hover:text-fuchsia-400 transition-colors hover:scale-110 active:scale-95">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="text-white/40">
          <Music className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 border-t border-white/5 pt-4">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] text-center mb-3">Up Next</p>
        <div className="space-y-2">
          {TRACKS.map((track, idx) => (
            <div
              key={track.id}
              onClick={() => { setCurrentTrackIndex(idx); setProgress(0); setIsPlaying(true); }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${idx === currentTrackIndex ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'hover:bg-white/5 text-white/40'}`}
            >
              <img src={track.cover} className="w-8 h-8 rounded object-cover opacity-50" alt="" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold truncate tracking-tight">{track.title}</span>
                <span className="text-[9px] uppercase tracking-widest opacity-50">{track.artist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
