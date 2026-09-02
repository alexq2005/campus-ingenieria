// tarjeta-perfil.jsx — Props avanzadas + composición con children.
// Demuestra: tipos de props (string, number, array, object, función, JSX),
//            destructuring con defaults, children slot, composición.

// Componente reutilizable que actúa como "contenedor"
function Card({ children, color = '#61dafb' }) {
  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: 12,
      padding: 16,
      maxWidth: 320,
      background: '#1a2332',
      color: '#e6edf3',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {children}
    </div>
  );
}

// Componente con props variadas
function TarjetaPerfil({ usuario, onMensaje, badge }) {
  return (
    <Card color={usuario.color}>
      <div style={{ textAlign: 'center' }}>
        <img
          src={usuario.foto}
          alt={usuario.nombre}
          style={{ borderRadius: '50%', width: 80, height: 80 }}
        />
        {badge}
      </div>
      <h2 style={{ margin: '8px 0 4px' }}>{usuario.nombre}</h2>
      <p style={{ color: '#8b949e', margin: '0 0 8px', fontStyle: 'italic' }}>
        {usuario.rol}
      </p>
      <p style={{ fontSize: 14 }}>
        Skills: {usuario.skills.join(' · ')}
      </p>
      <p style={{ fontSize: 14 }}>
        {usuario.skills.length} habilidades · {usuario.años} años de experiencia
      </p>
      <button
        onClick={() => onMensaje(usuario.id)}
        style={{
          background: usuario.color,
          color: '#0d1421',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Enviar mensaje
      </button>
    </Card>
  );
}

export default function App() {
  const usuarios = [
    {
      id: 1, nombre: 'Ana Pérez', rol: 'Frontend Developer',
      foto: 'https://i.pravatar.cc/120?u=ana', color: '#61dafb',
      skills: ['React', 'TypeScript', 'Tailwind'], años: 4,
    },
    {
      id: 2, nombre: 'Luis López', rol: 'Backend Developer',
      foto: 'https://i.pravatar.cc/120?u=luis', color: '#fb7185',
      skills: ['Node.js', 'Postgres', 'Docker'], años: 6,
    },
  ];

  function handleMensaje(id) {
    alert(`Enviar mensaje al usuario #${id}`);
  }

  return (
    <main style={{
      padding: 24,
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      background: '#0d1421',
      minHeight: '100vh',
    }}>
      {usuarios.map(u => (
        <TarjetaPerfil
          key={u.id}
          usuario={u}
          onMensaje={handleMensaje}
          badge={<span style={{
            display: 'inline-block', background: '#10b981', color: 'white',
            padding: '2px 8px', borderRadius: 999, fontSize: 11, marginTop: -8,
          }}>✓ Verificado</span>}
        />
      ))}
    </main>
  );
}
