import { useState } from 'react';

type CounterProps = {
  initial?: number;
  step?: number;
  label?: string;
};

export function Counter({ initial = 0, step = 1, label = 'Contador' }: CounterProps) {
  const [n, setN] = useState(initial);

  return (
    <div role="group" aria-label={label}>
      <p aria-live="polite">
        <strong>{label}:</strong> {n}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button className="btn" onClick={() => setN((prev) => prev - step)} aria-label="Disminuir">
          −{step}
        </button>
        <button className="btn" onClick={() => setN((prev) => prev + step)} aria-label="Aumentar">
          +{step}
        </button>
        <button
          className="btn"
          style={{ background: 'var(--color-text-muted)' }}
          onClick={() => setN(initial)}
          aria-label="Reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
