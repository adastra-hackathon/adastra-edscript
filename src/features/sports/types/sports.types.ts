export interface SportsMatch {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl: string | null;
  awayLogoUrl: string | null;
  startTime: string;
  isLive: boolean;
  oddsHome: number;
  oddsDraw: number;
  oddsAway: number;
  homeScore: number | null;
  awayScore: number | null;
  minute: number | null;
}

export interface SportsMatchesData {
  matches: SportsMatch[];
}

export type SportTab = 'futebol' | 'basquete' | 'tenis';
