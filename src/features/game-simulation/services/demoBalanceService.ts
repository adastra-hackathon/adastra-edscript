const INITIAL_DEMO_BALANCE = 1000;
let _balance = INITIAL_DEMO_BALANCE;

export const demoBalanceService = {
  getBalance: () => _balance,
  deduct: (amount: number) => { _balance = parseFloat((_balance - amount).toFixed(2)); },
  add: (amount: number) => { _balance = parseFloat((_balance + amount).toFixed(2)); },
  reset: () => { _balance = INITIAL_DEMO_BALANCE; },
  canBet: (amount: number) => _balance >= amount,
};
