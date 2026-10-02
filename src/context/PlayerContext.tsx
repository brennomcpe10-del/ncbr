import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player } from '../types/index.ts';
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

function buildPlayer(nickname: string): Player {
  const clean = nickname.trim();
  const now = new Date().toISOString();

  return {
    id: `player-${clean.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`,
    nickname: clean,
    createdAt: now,
    lastActive: now,
    activeVips: [],
    totalSpent: 0,
    ordersCount: 0
  };
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    try {
      const savedNickname = localStorage.getItem(STORAGE_KEY);

      if (savedNickname && savedNickname.trim().length >= 3) {
        setPlayer(buildPlayer(savedNickname));
        setIsLoginModalOpen(false);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setIsLoginModalOpen(true);
      }
    } catch (error) {
      console.error('Erro ao restaurar jogador:', error);
      setIsLoginModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (nickname: string): Promise<boolean> => {
    const clean = nickname.trim();

    if (clean.length < 3 || clean.length > 32) {
      showError('O nickname deve ter entre 3 e 32 caracteres.');
      return false;
    }

    try {
      const newPlayer = buildPlayer(clean);

      // O login do site é local e imediato.
      localStorage.setItem(STORAGE_KEY, clean);
      setPlayer(newPlayer);
      setIsLoginModalOpen(false);

      showSuccess(`Bem-vindo ao NetCraftBR, ${clean}!`);
      return true;
    } catch (error) {
      console.error('Erro ao entrar com nickname:', error);
      showError('Não foi possível entrar. Tente novamente.');
      return false;
    }
  };

  const logout = () => {
    const current = player;
    setPlayer(null);
    localStorage.removeItem(STORAGE_KEY);
    setIsLoginModalOpen(true);

    if (current) {
      showSuccess(`Até logo, ${current.nickname}!`);
    }
  };

  const refreshPlayer = async () => {
    if (!player) return;

    setPlayer({
      ...player,
      lastActive: new Date().toISOString()
    });
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
