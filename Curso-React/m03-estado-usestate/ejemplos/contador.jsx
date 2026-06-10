// contador.jsx — useState con múltiples features.
// Demuestra: useState, función updater (prev =>), estado de array,
//            estado derivado, validación, lazy initialization.

import { useState } from 'react';

export default function App() {
  // Estado simple
  const [count, setCount] = useState(0);

  // Estado de array — historia de cambios (lazy init para demo)
  const [history, setHistory] = useState(() => [0]);

  // Estado derivado: NO va en useState (se calcula en cada render)
  const max = Math.max(...history);
  const min = Math.min(...history);
  const promedio = (history.reduce((a, b) => a + b, 0) / history.length).toFixed(2);

  // Función updater para evitar bugs por batching
  function aplicar(delta) {
    setCount(prev => {
      const next = prev + delta;
      setHistory(h => [...h, next]);
      return next;
    });
  }

  function reset() {
    setCount(0);
    setHistory([0]);
  }

  // Validación en el render (no en estado)
  const enLimite = count >= 0 && count <= 10;

  return (
    <main style={{
      padding: 24,
      maxWidth: 480,
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      background: '#0d1421',
      color: '#e6edf3',
      minHeight: '100vh',
    }}>
      <h1>Contador con historia</h1>

      <div style={{
        fontSize: 64,
        textAlign: 'center',
        margin: '24px 0',
        color: enLimite ? '#61dafb' : '#ef4444',
      }}>
        {count}
      </div>

      {!enLimite && (
        <p style={{ color: '#ef4444', textAlign: 'center' }}>
          ⚠️ Fuera del rango 0-10
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        <button onClick={() => aplicar(-1)} disabled={count <= 0}>-1</button>
        <button onClick={() => aplicar(+1)} disabled={count >= 10}>+1</button>
        <button onClick={() => aplicar(+5)}>+5</button>
        <button onClick={reset}>Reset</button>
      </div>

      <hr style={{ border: '1px solid #2d3a4f' }} />

      <h3>Historia ({history.length} cambios)</h3>
      <p style={{ fontFamily: 'monospace', fontSize: 14 }}>
        {history.join(' → ')}
      </p>

      <h3>Estadísticas (derivadas)</h3>
      <ul>
        <li>Máximo: <strong>{max}</strong></li>
        <li>Mínimo: <strong>{min}</strong></li>
        <li>Promedio: <strong>{promedio}</strong></li>
      </ul>
    </main>
  );
}
