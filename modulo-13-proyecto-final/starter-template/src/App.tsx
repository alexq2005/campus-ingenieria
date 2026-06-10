import { Routes, Route, Link } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';
import NotFound from './routes/NotFound';
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <nav aria-label="Navegación principal">
          <Link to="/" className="logo">
            Capstone
          </Link>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
          <ThemeToggle />
        </nav>
      </header>

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <p>
          &copy; {new Date().getFullYear()} — Proyecto final CS-FE ·{' '}
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
