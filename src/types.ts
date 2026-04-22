export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number; // in seconds
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  isGameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
}
