import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext.tsx';
import { X } from 'lucide-react';

export const NicknameModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, player } = usePlayer();
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const submitLogin = async () => {
    if (submitting) return;

    const clean = nickname.trim();

    if (!clean) {
      setError('Digite seu nickname do Minecraft.');
      return;
    }

    if (clean.length < 3 || clean.length > 32) {
      setError('O nickname deve ter entre 3 e 32 caracteres.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const success = await login(clean);

      if (success) {
        setNickname('');
        setError('');
      } else {
        setError('Não foi possível entrar com esse nickname.');
      }
    } catch (err) {
      console.error('Nickname login error:', err);
      setError('Não foi possível entrar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitLogin();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-default"
        onClick={() => {
          if (player) closeLoginModal();
        }}
      />

      <div
        className="relative z-10 w-full max-w-sm bg-[#0d1017] border border-white/[0.08] rounded-2xl p-7 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nickname-title"
      >
        {player && (
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="mb-6">
          <h2
            id="nickname-title"
            className="text-xl font-bold font-heading text-white tracking-tight"
          >
            Digite seu nickname do Minecraft
          </h2>

          <p className="text-xs text-zinc-400 mt-1">
            Se for sua primeira vez, sua conta será criada automaticamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nickname}
            onChange={event => {
              setNickname(event.target.value);
              if (error) setError('');
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void submitLogin();
              }
            }}
            placeholder="Seu nickname"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            maxLength={32}
            disabled={submitting}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-colors disabled:opacity-60"
          />

          {error && (
            <p className="text-xs text-rose-400 font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            onClick={() => {
              // Explicit click handler in addition to the form submit handler.
              void submitLogin();
            }}
            disabled={submitting}
            className="relative z-20 w-full py-3 bg-white hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
