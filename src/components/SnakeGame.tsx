import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getRandomPoint = (): Point => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: getRandomPoint(),
    direction: 'UP',
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    speed: INITIAL_SPEED,
  });

  const directionRef = useRef<Direction>('UP');

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: getRandomPoint(),
      direction: 'UP',
      isGameOver: false,
      score: 0,
      highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
      speed: INITIAL_SPEED,
    });
    directionRef.current = 'UP';
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState((prev) => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check Wall Collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      // Check Self Collision
      if (prev.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;
      let newHighScore = prev.highScore;
      let newSpeed = prev.speed;

      // Check Food Collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = getRandomPoint();
        newScore += 10;
        if (newScore > newHighScore) {
          newHighScore = newScore;
          localStorage.setItem('snakeHighScore', newHighScore.toString());
        }
        newSpeed = Math.max(MIN_SPEED, prev.speed - SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        highScore: newHighScore,
        speed: newSpeed,
      };
    });
  }, [gameState.isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, gameState.speed);
    return () => clearInterval(interval);
  }, [moveSnake, gameState.speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(canvas.width, i * cellHeight);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellWidth + cellWidth / 2,
      gameState.food.y * cellHeight + cellHeight / 2,
      cellWidth / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#009999';
      ctx.shadowBlur = index === 0 ? 20 : 0;
      ctx.shadowColor = '#00ffff';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellWidth + padding,
        segment.y * cellHeight + padding,
        cellWidth - padding * 2,
        cellHeight - padding * 2
      );
    });
    
    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.1)]">
      <div className="flex justify-between w-full px-4 font-mono">
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="text-xs uppercase tracking-widest opacity-60">Score</span>
          <span className="text-2xl font-bold">{gameState.score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-2 text-fuchsia-400">
          <Trophy className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest opacity-60">Best</span>
          <span className="text-2xl font-bold">{gameState.highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative block rounded-lg border border-white/10 bg-black cursor-none"
          id="game-canvas"
        />

        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-lg"
            >
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-fuchsia-500 mb-2 uppercase tracking-tighter">
                Game Over
              </h2>
              <p className="text-cyan-400 mb-8 font-mono text-sm uppercase tracking-widest">
                Final Score: {gameState.score}
              </p>
              <button
                onClick={resetGame}
                className="group relative px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                id="reset-button"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  Try Again
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden md:flex gap-4 text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">
        <span>Use Arrow Keys to Move</span>
      </div>
    </div>
  );
}
