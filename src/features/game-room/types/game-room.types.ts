export type GameRoomStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';

export interface GameRoomPlayer {
  id: string;
  roomId: string;
  userId: string;
  isBot: boolean;
  displayName: string | null;
  initialBalance: number;
  finalBalance: number | null;
  profit: number | null;
  position: number | null;
  joinedAt: string;
}

export interface GameRoom {
  id: string;
  hostId: string;
  gameId: string;
  entryAmount: number;
  maxPlayers: number;
  status: GameRoomStatus;
  startAt: string | null;
  duration: number;
  prizePool: number;
  platformFee: number;
  winnerId: string | null;
  isSimulation: boolean;
  createdAt: string;
  updatedAt: string;
  players: GameRoomPlayer[];
}

export interface GameRoomVoucher {
  id: string;
  userId: string;
  roomId: string;
  amount: number;
  expiresAt: string;
  usedAt: string | null;
}

export interface CreateGameRoomPayload {
  gameId: string;
  entryAmount: number;
  maxPlayers?: number;
  startAt?: string;
  duration?: number;
  isSimulation?: boolean;
}

export interface FinishGameRoomPayload {
  results: Array<{ userId: string; finalBalance: number; position: number }>;
  winnerId: string;
  lastPlaceUserId: string;
}

export const GAME_ROOM_STATUS_LABELS: Record<GameRoomStatus, string> = {
  WAITING: 'Aguardando',
  IN_PROGRESS: 'Em andamento',
  FINISHED: 'Finalizada',
  CANCELLED: 'Cancelada',
};

export const GAME_ROOM_STATUS_COLORS: Record<GameRoomStatus, string> = {
  WAITING: '#FBBF24',
  IN_PROGRESS: '#38E67D',
  FINISHED: '#60A5FA',
  CANCELLED: '#FF6B6B',
};
