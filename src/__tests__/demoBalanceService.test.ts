import { demoBalanceService } from '../features/game-simulation/services/demoBalanceService';

const INITIAL_BALANCE = 1000;

describe('demoBalanceService', () => {
  beforeEach(() => {
    demoBalanceService.reset();
  });

  describe('getBalance', () => {
    it('returns 1000 on fresh start', () => {
      expect(demoBalanceService.getBalance()).toBe(INITIAL_BALANCE);
    });
  });

  describe('deduct', () => {
    it('reduces balance by the given amount', () => {
      demoBalanceService.deduct(100);
      expect(demoBalanceService.getBalance()).toBe(900);
    });

    it('handles decimal amounts correctly', () => {
      demoBalanceService.deduct(0.1);
      demoBalanceService.deduct(0.2);
      expect(demoBalanceService.getBalance()).toBe(999.7);
    });

    it('can reduce balance to zero', () => {
      demoBalanceService.deduct(1000);
      expect(demoBalanceService.getBalance()).toBe(0);
    });
  });

  describe('add', () => {
    it('increases balance by the given amount', () => {
      demoBalanceService.add(500);
      expect(demoBalanceService.getBalance()).toBe(1500);
    });

    it('handles decimal additions correctly', () => {
      demoBalanceService.add(10.55);
      expect(demoBalanceService.getBalance()).toBe(1010.55);
    });
  });

  describe('canBet', () => {
    it('returns true when balance is sufficient', () => {
      expect(demoBalanceService.canBet(500)).toBe(true);
      expect(demoBalanceService.canBet(1000)).toBe(true);
    });

    it('returns false when balance is insufficient', () => {
      expect(demoBalanceService.canBet(1001)).toBe(false);
    });

    it('returns false after deducting below bet amount', () => {
      demoBalanceService.deduct(950);
      expect(demoBalanceService.canBet(100)).toBe(false);
      expect(demoBalanceService.canBet(50)).toBe(true);
    });
  });

  describe('reset', () => {
    it('restores balance to initial value after deductions', () => {
      demoBalanceService.deduct(700);
      demoBalanceService.add(200);
      demoBalanceService.reset();
      expect(demoBalanceService.getBalance()).toBe(INITIAL_BALANCE);
    });
  });

  describe('full bet cycle', () => {
    it('deduct bet then add payout reflects correct balance', () => {
      demoBalanceService.deduct(100);       // balance: 900
      demoBalanceService.add(250);          // win: 250 payout → balance: 1150
      expect(demoBalanceService.getBalance()).toBe(1150);
    });

    it('multiple consecutive bets accumulate correctly', () => {
      demoBalanceService.deduct(10);  // 990
      demoBalanceService.deduct(10);  // 980
      demoBalanceService.add(40);     // 1020
      demoBalanceService.deduct(10);  // 1010
      expect(demoBalanceService.getBalance()).toBe(1010);
    });
  });
});
