import { create } from 'zustand';
import type { PendingRoute } from '../navigation/types';

/**
 * Armazena a rota que o usuário tentou acessar antes de estar autenticado.
 * Usada para redirecionar de volta após login bem-sucedido.
 */
interface NavigationState {
  pendingRoute: PendingRoute | null;
  setPendingRoute: (route: PendingRoute) => void;
  clearPendingRoute: () => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  pendingRoute: null,
  setPendingRoute: (route) => set({ pendingRoute: route }),
  clearPendingRoute: () => set({ pendingRoute: null }),
}));
