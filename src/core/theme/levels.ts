/**
 * Sistema de cores por nível de usuário.
 * Centralizado aqui para reutilização em todo o app:
 * UserCard, badges, perfil, ranking, etc.
 *
 * Cada nível tem 3 variações:
 *   primary   → cor principal (borda, ícone ativo)
 *   secondary → variação suave (backgrounds, containers)
 *   accent    → destaque/contraste (texto, badge label)
 */

export type UserLevel = 'bronze' | 'prata' | 'ouro' | 'diamante' | 'vip';

export const LEVEL_COLORS: Record<
  UserLevel,
  { primary: string; secondary: string; accent: string }
> = {
  bronze: {
    primary: '#CD7F32',   // cobre/bronze
    secondary: '#3D2410', // fundo escuro bronze
    accent: '#F0A96B',    // destaque claro
  },
  prata: {
    primary: '#A8A9AD',   // prata metálico
    secondary: '#252629', // fundo escuro neutro
    accent: '#D4D5D8',    // destaque claro
  },
  ouro: {
    primary: '#FFD700',   // ouro
    secondary: '#332B00', // fundo escuro dourado
    accent: '#FFE766',    // destaque claro
  },
  diamante: {
    primary: '#44D4F5',   // azul diamante
    secondary: '#062B35', // fundo escuro azul
    accent: '#A0EEFF',    // destaque claro
  },
  vip: {
    primary: '#C084FC',   // roxo VIP
    secondary: '#1E0B2C', // fundo escuro roxo
    accent: '#E0BBFF',    // destaque claro
  },
};

export function getLevelColors(level: string) {
  const normalized = level.toLowerCase() as UserLevel;
  return LEVEL_COLORS[normalized] ?? LEVEL_COLORS.bronze;
}
