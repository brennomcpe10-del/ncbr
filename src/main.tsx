import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('NETCRAFTBR APP ERROR:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#06090e',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '620px',
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: '16px',
            padding: '28px'
          }}>
            <h1 style={{ margin: '0 0 10px', fontSize: '20px' }}>
              O site encontrou um erro
            </h1>
            <p style={{ color: '#a1a1aa', margin: '0 0 18px' }}>
              Recarregue a página. Se o erro continuar, esta mensagem mostra exatamente o problema para podermos corrigir.
            </p>
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#fb7185',
              background: '#080b10',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '12px'
            }}>
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: '18px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 0,
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
