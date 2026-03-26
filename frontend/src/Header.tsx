import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './App.css'

const navItems = [
  { label: 'Requirements', to: '/requirements' },
  { label: 'Research', to: '/research' },
  { label: 'UI Design', to: '/ui-design' },
  { label: 'System Design', to: '/system-design' },
  { label: 'Implementation', to: '/implementation' },
  { label: 'Testing', to: '/testing' },
  { label: 'Manual', to: '/user-manual' },
  { label: 'Evaluation', to: '/evaluation' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  const handleNavClick = () => setMenuOpen(false)

  // Close menu when clicking outside
  const handleOverlayClick = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="site-title" onClick={handleNavClick}>
            Cresco
          </NavLink>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav
            aria-label="Main navigation"
            className={`main-nav ${menuOpen ? 'nav-open' : ''}`}
          >
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }: { isActive: boolean }) =>
                      isActive ? 'active-link' : undefined
                    }
                    onClick={handleNavClick}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      {menuOpen && (
        <div
          className="nav-overlay"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Header
