import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Player } from '../types/index.ts';
import { api } from '../lib/api.ts';
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
      if (savedNick) {
        const p = await api.getPlayer(savedNick);
        setPlayer(p);
      } else {
        // If not logged in yet, prompt the user smoothly with the nickname modal
        setIsLoginModalOpen(true);
      }
    } catch (err) {
      console.warn('Could not restore saved player session:', err);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedPlayer();
  }, [loadSavedPlayer]);

  const login = async (nickname: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.loginPlayer(nickname);
      setPlayer(res.player);
      localStorage.setItem(STORAGE_KEY, res.player.nickname);
      setIsLoginModalOpen(false);
      showSuccess(`Bem-vindo ao NetCraftBR, ${res.player.nickname}!`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao conectar com esse nickname.';
      showError(msg);
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
  };

  const refreshPlayer = async () => {
    if (!player) return;
    try {
      const updated = await api.getPlayer(player.nickname);
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
