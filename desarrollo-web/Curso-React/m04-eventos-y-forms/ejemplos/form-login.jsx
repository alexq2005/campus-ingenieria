// form-login.jsx — Form controlado con validación en vivo.
// Demuestra: inputs controlados, validación derivada, mensajes de error,
//            botón disabled, submit con preventDefault, estado de loading.

import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  // Validaciones derivadas (no en useState)
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwdLargaSuficiente = password.length >= 8;
  const pwdConNumero = /\d/.test(password);
  const pwdValida = pwdLargaSuficiente && pwdConNumero;
  const formValido = emailValido && pwdValida && acepta;

  async function handleSubmit(e) {
    e.preventDefault();           // ⭐ evitar reload del browser
    setEnviando(true);
    setResultado(null);

    // Simular request async
    await new Promise(r => setTimeout(r, 1000));

    setResultado({ tipo: 'ok', mensaje: `Bienvenido, ${email}` });
    setEnviando(false);
  }

  const baseInput = {
    width: '100%', padding: 10, marginTop: 4, marginBottom: 4,
    background: '#0d1421', border: '1px solid #2d3a4f', borderRadius: 6,
    color: '#e6edf3', fontSize: 14, fontFamily: 'inherit',
  };

  return (
    <main style={{
      padding: 24, maxWidth: 420, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      background: '#0d1421', color: '#e6edf3', minHeight: '100vh',
    }}>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ana@ejemplo.com"
            style={baseInput}
          />
        </label>
        {email && !emailValido && (
          <p style={{ color: '#ef4444', fontSize: 12 }}>
            ⚠️ Formato de email inválido
          </p>
        )}

        {/* Password */}
        <label style={{ marginTop: 12, display: 'block' }}>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={baseInput}
          />
        </label>
        {password && !pwdValida && (
          <ul style={{ color: '#ef4444', fontSize: 12, paddingLeft: 16 }}>
            {!pwdLargaSuficiente && <li>Mínimo 8 caracteres</li>}
            {!pwdConNumero && <li>Al menos 1 número</li>}
          </ul>
        )}

        {/* Checkbox */}
        <label style={{ display: 'block', marginTop: 12, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)}
          />
          {' '}Acepto los términos y condiciones
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={!formValido || enviando}
          style={{
            marginTop: 16, padding: '10px 20px',
            background: formValido && !enviando ? '#61dafb' : '#2d3a4f',
            color: formValido && !enviando ? '#0d1421' : '#8b949e',
            border: 'none', borderRadius: 6,
            cursor: formValido && !enviando ? 'pointer' : 'not-allowed',
            fontWeight: 600, fontSize: 14,
          }}
        >
          {enviando ? 'Enviando...' : 'Entrar'}
        </button>
      </form>

      {/* Mensaje de resultado */}
      {resultado && (
        <div style={{
          marginTop: 16, padding: 12,
          background: resultado.tipo === 'ok' ? '#10b98122' : '#ef444422',
          border: `1px solid ${resultado.tipo === 'ok' ? '#10b981' : '#ef4444'}`,
          borderRadius: 6,
        }}>
          {resultado.mensaje}
        </div>
      )}

      <hr style={{ border: '1px solid #2d3a4f', margin: '24px 0' }} />

      <details>
        <summary style={{ cursor: 'pointer', color: '#61dafb' }}>
          🔍 Ver estado actual (debug)
        </summary>
        <pre style={{ fontSize: 12, background: '#0b1019', padding: 8 }}>
          {JSON.stringify({ email, password, acepta, formValido }, null, 2)}
        </pre>
      </details>
    </main>
  );
}
