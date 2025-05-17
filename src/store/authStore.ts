import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AuthState {
  walletAddress: string
  tokenName: string
  tokenValue: string
  isLoggedIn: boolean
  loading: boolean
}

interface AuthActions {
  setAuth: (auth: Partial<AuthState>) => void
  clearAuth: () => void
}

const initialState: AuthState = {
  walletAddress: '',
  tokenName: '',
  tokenValue: '',
  isLoggedIn: false,
  loading: false,
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (auth) => 
        set((state) => ({
          ...state,
          ...auth,
          isLoggedIn: !!(auth.walletAddress || state.walletAddress),
        })),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        tokenName: state.tokenName,
        tokenValue: state.tokenValue,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
) 