// hello.jsx — Primer componente React.
// Demuestra: JSX, función componente, props, expresiones JS dentro de JSX.

function Saludo({ nombre, edad }) {
  const esMayor = edad >= 18;

  return (
    <div className="tarjeta" style={{
      border: '1px solid #61dafb',
      borderRadius: 8,
      padding: 16,
      maxWidth: 300,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h2>Hola, {nombre} 👋</h2>
      <p>Edad: <strong>{edad}</strong></p>
      <p>Estado: {esMayor ? '✅ Mayor de edad' : '🚸 Menor de edad'}</p>
      <p>Año aproximado de nacimiento: {2026 - edad}</p>
    </div>
  );
}

// App raíz: usa Saludo 3 veces con props distintas
export default function App() {
  return (
    <main style={{ padding: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <h1>Hello World — React</h1>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Saludo nombre="Ana" edad={30} />
        <Saludo nombre="Luis" edad={17} />
        <Saludo nombre="Eva" edad={45} />
      </div>
    </main>
  );
}
