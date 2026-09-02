// lista-tareas.jsx — CRUD completo con listas, keys e immutability.
// Demuestra: map con key estable, filter, conditional rendering,
//            agregar/quitar/toggle items SIN mutar el array.

import { useState } from 'react';

export default function App() {
  const [tareas, setTareas] = useState([
    { id: crypto.randomUUID(), texto: 'Aprender React', hecha: true },
    { id: crypto.randomUUID(), texto: 'Practicar useState', hecha: false },
    { id: crypto.randomUUID(), texto: 'Construir mi capstone', hecha: false },
  ]);

  const [nueva, setNueva] = useState('');
  const [filtro, setFiltro] = useState('todas'); // 'todas' | 'pendientes' | 'hechas'

  // Filtrar SIN mutar
  const visibles = tareas.filter(t => {
    if (filtro === 'pendientes') return !t.hecha;
    if (filtro === 'hechas') return t.hecha;
    return true;
  });

  // Derivado: cuántas pendientes
  const pendientes = tareas.filter(t => !t.hecha).length;

  function agregar() {
    const texto = nueva.trim();
    if (!texto) return;

    // ✅ Nuevo array — NO push
    setTareas(prev => [
      ...prev,
      { id: crypto.randomUUID(), texto, hecha: false },
    ]);
    setNueva('');
  }

  function toggle(id) {
    // ✅ map para reemplazar uno — devuelve nuevo array
    setTareas(prev => prev.map(t =>
      t.id === id ? { ...t, hecha: !t.hecha } : t
    ));
  }

  function eliminar(id) {
    // ✅ filter para quitar — devuelve nuevo array
    setTareas(prev => prev.filter(t => t.id !== id));
  }

  function limpiarHechas() {
    setTareas(prev => prev.filter(t => !t.hecha));
  }

  return (
    <main style={{
      padding: 24, maxWidth: 480, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      background: '#0d1421', color: '#e6edf3', minHeight: '100vh',
    }}>
      <h1>📝 Mis Tareas</h1>
      <p style={{ color: '#8b949e' }}>
        {pendientes} pendiente{pendientes !== 1 && 's'} · {tareas.length} total
      </p>

      {/* Form para agregar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregar()}
          placeholder="Nueva tarea (Enter)..."
          style={{
            flex: 1, padding: 8, background: '#1a2332',
            border: '1px solid #2d3a4f', borderRadius: 6,
            color: '#e6edf3',
          }}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['todas', 'pendientes', 'hechas'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              background: filtro === f ? '#61dafb' : '#1a2332',
              color: filtro === f ? '#0d1421' : '#e6edf3',
              border: '1px solid #2d3a4f',
              padding: '4px 12px', borderRadius: 999,
              cursor: 'pointer', textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista — conditional rendering */}
      {visibles.length === 0 ? (
        <p style={{ color: '#8b949e', fontStyle: 'italic' }}>
          {tareas.length === 0
            ? 'Sin tareas aún. ¡Agregá una!'
            : `Sin tareas ${filtro}.`}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {visibles.map(t => (
            <li
              key={t.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: 8, marginBottom: 4,
                background: '#1a2332', borderRadius: 6,
              }}
            >
              <input
                type="checkbox"
                checked={t.hecha}
                onChange={() => toggle(t.id)}
              />
              <span style={{
                flex: 1,
                textDecoration: t.hecha ? 'line-through' : 'none',
                color: t.hecha ? '#8b949e' : '#e6edf3',
              }}>
                {t.texto}
              </span>
              <button
                onClick={() => eliminar(t.id)}
                style={{
                  background: 'transparent', border: 'none',
                  color: '#ef4444', cursor: 'pointer', fontSize: 16,
                }}
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Acción global */}
      {tareas.some(t => t.hecha) && (
        <button
          onClick={limpiarHechas}
          style={{
            marginTop: 16, background: 'transparent',
            color: '#ef4444', border: '1px solid #ef4444',
            padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
          }}
        >
          Limpiar completadas ({tareas.filter(t => t.hecha).length})
        </button>
      )}
    </main>
  );
}
