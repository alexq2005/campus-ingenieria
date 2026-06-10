// use-local-storage.jsx — Custom hook + 3 ejemplos de uso.
// Demuestra: extraer lógica reutilizable, sincronizar con localStorage,
//            lazy init para leer del storage, sintaxis idéntica a useState.

import { useState, useEffect } from 'react';

// ─── CUSTOM HOOK ───
// Devuelve [valor, setter] como useState, pero persiste en localStorage.
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    // Lazy init: solo se ejecuta al montar
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Sync a localStorage cada vez que cambia value
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Error guardando en localStorage:', err);
    }
  }, [key, value]);

  return [value, setValue];
}

// ─── USO 1: tema persistido ───
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  return (
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      style={{
        padding: '8px 16px',
        background: theme === 'dark' ? '#1a2332' : '#fff',
        color: theme === 'dark' ? '#e6edf3' : '#0d1421',
        border: '1px solid #61dafb',
        borderRadius: 6, cursor: 'pointer',
      }}
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

// ─── USO 2: contador persistido ───
function Counter() {
  const [count, setCount] = useLocalStorage('counter', 0);

  return (
    <div style={{ background: '#1a2332', padding: 16, borderRadius: 8 }}>
      <p>Click count (persiste a F5): <strong>{count}</strong></p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(0)} style={{ marginLeft: 8 }}>Reset</button>
    </div>
  );
}

// ─── USO 3: usuario con objeto ───
function UserProfile() {
  const [user, setUser] = useLocalStorage('user', {
    nombre: '',
    email: '',
  });

  return (
    <div style={{ background: '#1a2332', padding: 16, borderRadius: 8 }}>
      <input
        value={user.nombre}
        onChange={(e) => setUser({ ...user, nombre: e.target.value })}
        placeholder="Nombre"
        style={{ padding: 6, marginBottom: 8, width: '100%' }}
      />
      <input
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
        style={{ padding: 6, width: '100%' }}
      />
      <p style={{ fontSize: 12, color: '#8b949e', marginTop: 8 }}>
        Cerrá la pestaña y volvé: los valores persisten.
      </p>
    </div>
  );
}

// ─── APP ───
export default function App() {
  return (
    <main style={{
      padding: 24, maxWidth: 600, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      background: '#0d1421', color: '#e6edf3', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <h1>🎣 useLocalStorage — Custom Hook</h1>

      <p style={{ color: '#8b949e' }}>
        Un hook de ~20 líneas que reusamos en 3 componentes. La <strong>lógica</strong>
        (sync con localStorage) está extraída — los componentes no saben de
        <code style={{ padding: '0 4px' }}>localStorage.getItem</code> ni
        <code style={{ padding: '0 4px' }}>JSON.parse</code>.
      </p>

      <section>
        <h2>1. Tema</h2>
        <ThemeToggle />
      </section>

      <section>
        <h2>2. Contador</h2>
        <Counter />
      </section>

      <section>
        <h2>3. Datos de usuario</h2>
        <UserProfile />
      </section>

      <hr style={{ border: '1px solid #2d3a4f' }} />

      <p style={{ fontSize: 14, color: '#8b949e' }}>
        💡 Abrí DevTools → Application → Local Storage para ver las claves
        <code>theme</code>, <code>counter</code> y <code>user</code> actualizándose.
      </p>
    </main>
  );
}
