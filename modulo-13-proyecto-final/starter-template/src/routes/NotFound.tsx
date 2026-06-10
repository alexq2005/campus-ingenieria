import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p>Esta página no existe.</p>
      <Link to="/" className="btn" style={{ marginTop: 'var(--space-md)' }}>
        Volver al inicio
      </Link>
    </section>
  );
}
