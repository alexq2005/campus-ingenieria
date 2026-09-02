import { useState } from 'react';
import { Counter } from '@/components/Counter';

export default function Home() {
  const [nombre, setNombre] = useState('');

  return (
    <section>
      <h1>¡Hola, Capstone!</h1>
      <p>
        Este es el starter template. Empezá renombrando esta página, reemplazando el hero y
        construyendo tu MVP.
      </p>

      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <h2>Demo — form controlado</h2>
        <label htmlFor="name-input">Tu nombre</label>
        <input
          id="name-input"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ada Lovelace"
          style={{
            display: 'block',
            width: '100%',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            marginTop: 'var(--space-xs)',
          }}
        />
        {nombre && <p style={{ marginTop: 'var(--space-sm)' }}>👋 Hola, {nombre}</p>}
      </div>

      <div className="card" style={{ marginTop: 'var(--space-md)' }}>
        <h2>Demo — componente con estado</h2>
        <Counter initial={0} />
      </div>
    </section>
  );
}
