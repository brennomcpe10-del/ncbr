import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext.tsx';
import { X } from 'lucide-react';

export const NicknameModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, player } = usePlayer();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nickname.trim();
    if (!clean) {
      setError('Digite seu nickname do Minecraft');
      return;
    }
    if (clean.length < 3) {
      setError('O nickname deve ter no mínimo 3 caracteres');
      return;
    }

    setError('');
    setLoading(true);
    const ok = await login(clean);
    setLoading(false);
    if (ok) {
      setNickname('');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={() => {
          if (player) closeLoginModal();
        }}
      />
      <div className="relative w-full max-w-sm bg-[#0d1017] border border-white/[0.08] rounded-2xl p-7 shadow-2xl z-10">
        {player && (
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">
            Digite seu nickname do Minecraft
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Se for sua primeira vez, sua conta será criada automaticamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={nickname}
              onChange={e => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="Seu nickname"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              autoFocus
              maxLength={32}
            />
            {error && (
              <p className="text-xs text-rose-400 mt-2 font-medium">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
