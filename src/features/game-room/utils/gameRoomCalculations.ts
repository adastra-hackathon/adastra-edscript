import type { GameRoom } from '../types/game-room.types';

export function calcPrizePool(entryAmount: number, playerCount: number): number {
  return Number((entryAmount * playerCount).toFixed(2));
}

export function calcWinnerPrize(prizePool: number): number {
  return Number((prizePool * 0.99).toFixed(2));
}

export function calcPlatformFee(prizePool: number): number {
  return Number((prizePool * 0.01).toFixed(2));
}

export function calcProfit(finalBalance: number, initialBalance: number): number {
  return Number((finalBalance - initialBalance).toFixed(2));
}

export function getVoucherExpiry(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function canJoinRoom(
  room: GameRoom,
  userId: string,
  userBalance: number,
): { canJoin: boolean; reason?: string } {
  if (room.status !== 'WAITING') {
    return { canJoin: false, reason: 'Sala não está aguardando jogadores.' };
  }
  if (room.players.length >= room.maxPlayers) {
    return { canJoin: false, reason: 'Sala está cheia.' };
  }
  if (room.players.some((p) => p.userId === userId)) {
    return { canJoin: false, reason: 'Você já entrou nesta sala.' };
  }
  if (userBalance < room.entryAmount) {
    return { canJoin: false, reason: 'Saldo insuficiente.' };
  }
  return { canJoin: true };
}
