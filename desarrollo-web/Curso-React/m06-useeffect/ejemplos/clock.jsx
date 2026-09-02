// clock.jsx — useEffect con cleanup, listeners y timer.
// Demuestra: setInterval con cleanup, window event listeners,
//            document.title sync, useEffect con dependencias.

import { useState, useEffect } from 'react';

export default function App() {
  // Reloj que se actualiza cada segundo
  const [hora, setHora] = useState(new Date());

  // Ancho de ventana reactivo
  const [width, setWidth] = useState(window.innerWidth);

  // Conexión online/offline
  const [online, setOnline] = useState(navigator.onLine);

  // ─── Effect 1: timer con cleanup ───
  useEffect(() => {
    console.log('⏰ Iniciando timer');

    const id = setInterval(() => {
      setHora(new Date());
    }, 1000);

    // Cleanup: cancelar timer al desmontar o re-ejecutar
    return () => {
      console.log('⏰ Cancelando timer');
      clearInterval(id);
    };
  }, []);  // [] = solo al montar

  // ─── Effect 2: resize listener con cleanup ───
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── Effect 3: online/offline ───
  useEffect(() => {
    function onConnect() { setOnline(true); }
    function onDisconnect() { setOnline(false); }

    window.addEventListener('online', onConnect);
    window.addEventListener('offline', onDisconnect);

    return () => {
      window.removeEventListener('online', onConnect);
      window.removeEventListener('offline', onDisconnect);
    };
  }, []);

  // ─── Effect 4: sincronizar title del documento ───
  useEffect(() => {
    document.title = `${hora.toLocaleTimeString()} — Clock`;

    return () => {
      // Cleanup: restaurar al desmontar
      document.title = 'App';
    };
  }, [hora]);  // re-ejecuta cuando cambia hora

  return (
    <main style={{
      padding: 24, textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#0d1421', color: '#e6edf3', minHeight: '100vh',
    }}>
      <h1>⏰ Reloj con useEffect</h1>

      {/* Reloj */}
      <div style={{
        fontSize: 96, fontFamily: 'monospace',
        margin: '32px 0', color: '#61dafb',
        letterSpacing: -2,
      }}>
        {hora.toLocaleTimeString()}
      </div>

      <p style={{ color: '#8b949e', fontSize: 14 }}>
        {hora.toLocaleDateString('es-AR', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>

      <hr style={{ border: '1px solid #2d3a4f', margin: '32px 0' }} />

      {/* Otros efectos */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Tarjeta titulo="Ancho ventana" valor={`${width}px`} />
        <Tarjeta
          titulo="Conexión"
          valor={online ? '🟢 Online' : '🔴 Offline'}
        />
        <Tarjeta
          titulo="Title sync"
          valor="Mirá la pestaña del browser"
        />
      </div>

      <details style={{ marginTop: 32, textAlign: 'left' }}>
        <summary style={{ cursor: 'pointer', color: '#61dafb' }}>
          🧪 Probá los efectos
        </summary>
        <ul style={{ color: '#8b949e', fontSize: 14 }}>
          <li>Redimensioná la ventana → el ancho se actualiza.</li>
          <li>Modo avión / offline en DevTools → el indicador cambia.</li>
          <li>El title del browser se actualiza cada segundo.</li>
          <li>Abrí DevTools console → ves logs del cleanup en cada re-mount (StrictMode dev).</li>
        </ul>
      </details>
    </main>
  );
}

function Tarjeta({ titulo, valor }) {
  return (
    <div style={{
      padding: 16, background: '#1a2332',
      border: '1px solid #2d3a4f', borderRadius: 8, minWidth: 140,
    }}>
      <p style={{ margin: 0, fontSize: 12, color: '#8b949e' }}>{titulo}</p>
      <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 600 }}>{valor}</p>
    </div>
  );
}
