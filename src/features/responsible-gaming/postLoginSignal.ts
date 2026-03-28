/**
 * Sinal módulo-level para exibir o modal de jogo responsável após login/cadastro.
 * Evita race conditions com estado React e transições de foco.
 */
let _pending = false;

export const postLoginSignal = {
  set: () => { _pending = true; },
  consume: () => {
    const value = _pending;
    _pending = false;
    return value;
  },
  peek: () => _pending,
};
