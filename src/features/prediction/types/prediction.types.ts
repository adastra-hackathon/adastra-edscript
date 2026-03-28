export type PredictionRoomStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';
export type PredictionPlayerStatus = 'WAITING' | 'PREDICTING' | 'READY';

export interface PredictionOption {
  id: string;
  eventId: string;
  label: string;
  sortOrder: number;
}

export interface PredictionEvent {
  id: string;
  roomId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  correctOptionId: string | null;
  createdAt: string;
  options: PredictionOption[];
}

export interface UserPrediction {
  id: string;
  playerId: string;
  eventId: string;
  optionId: string;
  isCorrect: boolean | null;
  createdAt: string;
}

export interface PredictionRoomPlayer {
  id: string;
  roomId: string;
  userId: string;
  isBot: boolean;
  displayName: string | null;
  status: PredictionPlayerStatus;
  score: number;
  position: number | null;
  joinedAt: string;
  predictions: UserPrediction[];
}

export interface PredictionRoom {
  id: string;
  hostId: string;
  title: string;
  entryAmount: number;
  maxPlayers: number;
  status: PredictionRoomStatus;
  predictionsDeadline: string | null;
  prizePool: number;
  platformFee: number;
  winnerId: string | null;
  isSimulation: boolean;
  createdAt: string;
  updatedAt: string;
  players: PredictionRoomPlayer[];
  events: PredictionEvent[];
}

export interface CreatePredictionRoomPayload {
  title: string;
  entryAmount: number;
  maxPlayers?: number;
  predictionsDeadline?: string;
  isSimulation?: boolean;
  events: Array<{
    title: string;
    description?: string;
    sortOrder: number;
    options: Array<{ label: string; sortOrder: number }>;
  }>;
}

export interface FinishPredictionRoomPayload {
  correctOptions: Array<{ eventId: string; optionId: string }>;
}

export const PREDICTION_STATUS_LABELS: Record<PredictionRoomStatus, string> = {
  WAITING: 'Aguardando',
  IN_PROGRESS: 'Em andamento',
  FINISHED: 'Finalizada',
  CANCELLED: 'Cancelada',
};

export const PREDICTION_STATUS_COLORS: Record<PredictionRoomStatus, string> = {
  WAITING: '#FBBF24',
  IN_PROGRESS: '#38E67D',
  FINISHED: '#60A5FA',
  CANCELLED: '#FF6B6B',
};

export const PREDICTION_PLAYER_STATUS_LABELS: Record<PredictionPlayerStatus, string> = {
  WAITING: 'Aguardando',
  PREDICTING: 'Palpitando',
  READY: 'Pronto',
};

export const PREDICTION_PLAYER_STATUS_COLORS: Record<PredictionPlayerStatus, string> = {
  WAITING: '#FBBF24',
  PREDICTING: '#A78BFA',
  READY: '#38E67D',
};
