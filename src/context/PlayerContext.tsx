import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Player } from '../types/index.ts';
import { getOrCreatePlayerInFirestore } from '../lib/firestoreSync.ts';
import { useToast } from './ToastContext.tsx';

interface PlayerContextType {
  player: Player | null;
  loading: boolean;
  login: (nickname: string) => Promise<boolean>;
  logout: () => void;
  refreshPlayer: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const STORAGE_KEY = 'netcraftbr_player_nickname';

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();

  const loadSavedPlayer = useCallback(async () => {
    try {
      const savedNick = localStorage.getItem(STORAGE_KEY);

      if (!savedNick) {
        setIsLoginModalOpen(true);
        return;
      }

      const restoredPlayer = await getOrCreatePlayerInFirestore(savedNick);
      setPlayer(restoredPlayer);
      localStorage.setItem(STORAGE_KEY, restoredPlayer.nickname);
    } catch (err) {
      console.warn('Could not restore saved player session:', err);
      localStorage.removeItem(STORAGE_KEY);
      setPlayer(null);
      setIsLoginModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedPlayer();
  }, [loadSavedPlayer]);

  const login = async (nickname: string): Promise<boolean> => {
    const clean = nickname.trim();

    if (clean.length < 3 || clean.length > 32) {
      showError('O nickname deve conter entre 3 e 32 caracteres.');
      return false;
    }

    try {
      setLoading(true);
      const playerFromFirestore = await getOrCreatePlayerInFirestore(clean);

      setPlayer(playerFromFirestore);
      localStorage.setItem(STORAGE_KEY, playerFromFirestore.nickname);
      setIsLoginModalOpen(false);
      showSuccess(`Bem-vindo ao NetCraftBR, ${playerFromFirestore.nickname}!`);
      return true;
    } catch (err: unknown) {
      console.error('Player login error:', err);
      const msg = err instanceof Error
        ? err.message
        : 'Não foi possível salvar seu nickname. Tente novamente.';
      showError(`Erro ao entrar: ${msg}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (player) {
      showSuccess(`Até logo, ${player.nickname}!`);
    }
    setPlayer(null);
    localStorage.removeItem(STORAGE_KEY);
    setIsLoginModalOpen(true);
  };

  const refreshPlayer = async () => {
    if (!player) return;

    try {
      const updated = await getOrCreatePlayerInFirestore(player.nickname);
      setPlayer(updated);
    } catch (err) {
      console.error('Error refreshing player data:', err);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        loading,
        login,
        logout,
        refreshPlayer,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false)
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
