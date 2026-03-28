export type SlotVolatility = 'low' | 'medium' | 'high';

export interface ProbabilityBand {
  result: 'loss' | 'small' | 'medium' | 'high';
  weight: number;
  minMultiplier: number;
  maxMultiplier: number;
}

export const PROBABILITY_TABLE: Record<SlotVolatility, ProbabilityBand[]> = {
  low: [
    { result: 'loss',   weight: 55, minMultiplier: 0,   maxMultiplier: 0  },
    { result: 'small',  weight: 30, minMultiplier: 1.2, maxMultiplier: 2  },
    { result: 'medium', weight: 13, minMultiplier: 2,   maxMultiplier: 10 },
    { result: 'high',   weight: 2,  minMultiplier: 10,  maxMultiplier: 50 },
  ],
  medium: [
    { result: 'loss',   weight: 65, minMultiplier: 0,   maxMultiplier: 0  },
    { result: 'small',  weight: 22, minMultiplier: 1.2, maxMultiplier: 2  },
    { result: 'medium', weight: 10, minMultiplier: 2,   maxMultiplier: 10 },
    { result: 'high',   weight: 3,  minMultiplier: 10,  maxMultiplier: 50 },
  ],
  high: [
    { result: 'loss',   weight: 75, minMultiplier: 0,   maxMultiplier: 0  },
    { result: 'small',  weight: 12, minMultiplier: 1.2, maxMultiplier: 2  },
    { result: 'medium', weight: 9,  minMultiplier: 2,   maxMultiplier: 10 },
    { result: 'high',   weight: 4,  minMultiplier: 10,  maxMultiplier: 50 },
  ],
};
