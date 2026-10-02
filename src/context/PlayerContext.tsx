import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Player } from '../types/index.ts';
import { getOrCreatePlayerInFirestore, saveUserToFirestore } from '../lib/firestoreSync.ts';
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

function createLocalPlayer(nickname: string, existing?: Partial<Player>): Player {
  const now = new Date().toISOString();

  return {
    id: existing?.id || `local-${nickname.trim().toLowerCase().replace(/[^a-z0-9_\-.]/g, '-')}`,
    nickname: existing?.nickname || nickname.trim(),
    createdAt: existing?.createdAt || now,
    lastActive: now,
    activeVips: existing?.activeVips || [],
    totalSpent: existing?.totalSpent || 0,
    ordersCount: existing?.ordersCount || 0,
    avatarUrl: existing?.avatarUrl,
    bio: existing?.bio
  };
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();

  const syncPlayerInBackground = useCallback(async (nickname: string) => {
    try {
      const remotePlayer = await getOrCreatePlayerInFirestore(nickname);
      setPlayer(current => {
        if (!current || current.nickname.toLowerCase() !== remotePlayer.nickname.toLowerCase()) {
          return current;
        }
        localStorage.setItem(STORAGE_KEY, remotePlayer.nickname);
        return remotePlayer;
      });
    } catch (err) {
      console.warn('Firestore player sync skipped:', err);
    }
  }, []);

  const loadSavedPlayer = useCallback(async () => {
    const savedNick = localStorage.getItem(STORAGE_KEY);

    if (!savedNick) {
      setLoading(false);
      setIsLoginModalOpen(true);
      return;
    }

    const localPlayer = createLocalPlayer(savedNick);
    setPlayer(localPlayer);
    setLoading(false);

    void syncPlayerInBackground(savedNick);
  }, [syncPlayerInBackground]);

  useEffect(() => {
    void loadSavedPlayer();
  }, [loadSavedPlayer]);

  const login = async (nickname: string): Promise<boolean> => {
    const clean = nickname.trim();

    if (clean.length < 3 || clean.length > 32) {
      showError('O nickname deve conter entre 3 e 32 caracteres.');
      return false;
    }

    const localPlayer = createLocalPlayer(clean);

    // A entrada no site não depende de API ou Firestore.
    setPlayer(localPlayer);
    localStorage.setItem(STORAGE_KEY, localPlayer.nickname);
    setIsLoginModalOpen(false);
    showSuccess(`Bem-vindo ao NetCraftBR, ${localPlayer.nickname}!`);

    // Sincronização remota acontece sem bloquear o login.
    void syncPlayerInBackground(clean);

    // Best effort: também tenta manter o jogador salvo mesmo se a leitura remota falhar.
    void saveUserToFirestore(localPlayer).catch(err => {
      console.warn('Could not save local player to Firestore:', err);
    });

    return true;
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

    const localPlayer = createLocalPlayer(player.nickname, player);
    setPlayer(localPlayer);

    try {
      const updated = await getOrCreatePlayerInFirestore(player.nickname);
      setPlayer(updated);
    } catch (err) {
      console.warn('Could not refresh player from Firestore:', err);
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
