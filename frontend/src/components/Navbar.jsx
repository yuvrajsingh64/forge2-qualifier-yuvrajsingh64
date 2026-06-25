import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="8" height="22" rx="2.5" fill="currentColor" opacity="0.9"/>
          <rect x="14" y="2" width="10" height="13" rx="2.5" fill="currentColor" opacity="0.6"/>
          <rect x="14" y="18" width="10" height="6" rx="2.5" fill="currentColor" opacity="0.4"/>
        </svg>
        Kanban
      </Link>
      <div className="navbar-actions">
        <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>Forge 2</span>
      </div>
    </nav>
  )
}
