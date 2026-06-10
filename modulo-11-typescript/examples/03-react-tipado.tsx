// ============================================================
// TypeScript + React — componente tipado completamente
// Para usar: `npm create vite@latest ... --template react-ts`
// y poner este archivo como src/components/UserList.tsx
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode, ChangeEvent, FormEvent } from 'react';

// ─────────────────────────
// Tipos del dominio
// ─────────────────────────
type User = {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

// ─────────────────────────
// Props del componente
// ─────────────────────────
type UserListProps = {
  apiUrl: string;
  onUserSelect?: (user: User) => void;   // opcional
  emptyFallback?: ReactNode;              // JSX/texto a mostrar si vacío
  children?: ReactNode;
};

// ─────────────────────────
// Custom hook genérico
// ─────────────────────────
function useFetch<T>(url: string): { data: T | null; status: Status; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus('loading');
    fetch(url, { signal: ctrl.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<T>;
      })
      .then(d => { setData(d); setStatus('success'); })
      .catch((e: unknown) => {
        if (e instanceof Error && e.name !== 'AbortError') {
          setError(e.message); setStatus('error');
        }
      });
    return () => ctrl.abort();
  }, [url]);

  return { data, status, error };
}

// ─────────────────────────
// Componente
// ─────────────────────────
export function UserList({ apiUrl, onUserSelect, emptyFallback, children }: UserListProps) {
  const { data, status, error } = useFetch<User[]>(apiUrl);
  const [filtro, setFiltro] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFiltro = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TS sabe que e.currentTarget es HTMLFormElement
  };

  if (status === 'loading') return <p>Cargando...</p>;
  if (status === 'error')   return <p>Error: {error}</p>;
  if (!data || data.length === 0) return <>{emptyFallback ?? <p>Sin usuarios</p>}</>;

  const visibles = data.filter(u =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <section>
      {children}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={filtro}
          onChange={handleFiltro}
          placeholder="Filtrar por nombre"
        />
      </form>
      <ul>
        {visibles.map(u => (
          <li key={u.id} onClick={() => onUserSelect?.(u)}>
            <strong>{u.nombre}</strong> · {u.email}
            {u.activo && <span> · ✓</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─────────────────────────
// Uso
// ─────────────────────────
// <UserList
//   apiUrl="/api/users"
//   onUserSelect={(u) => console.log(u.id)}   // u es User — autocompletado total
//   emptyFallback={<p>Nadie registrado</p>}
// >
//   <h2>Usuarios</h2>
// </UserList>
