import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './App.css'

type NavItem =
  | { label: string; to: string }
  | { label: string; children: Array<{ label: string; to: string }> }

const navItems: NavItem[] = [
  { label: 'Requirements', to: '/requirements' },
  { label: 'Research', to: '/research' },
  { label: 'UI Design', to: '/ui-design' },
  { label: 'System Design', to: '/system-design' },
  { label: 'Implementation', to: '/implementation' },
  { label: 'Testing', to: '/testing' },
  {
    label: 'Appendices',
    children: [
      { label: 'User Manual', to: '/appendices/user-manual' },
      { label: 'Deployment Manual', to: '/appendices/deployment-manual' },
      { label: 'Legal Reference', to: '/appendices/legal-reference' },
      { label: 'Videos', to: '/appendices/videos' },
    ],
  },
  { label: 'Evaluation', to: '/evaluation' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [appendicesOpen, setAppendicesOpen] = useState(false)

  // Close menu on route change
  const handleNavClick = () => {
    setMenuOpen(false)
    setAppendicesOpen(false)
  }

  // Close menu when clicking outside
  const handleOverlayClick = () => {
    setMenuOpen(false)
    setAppendicesOpen(false)
  }

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
              {navItems.map((item) => {
                if ('children' in item) {
                  return (
                    <li key={item.label} className="nav-dropdown">
                      <details
                        className="nav-details"
                        open={appendicesOpen}
                        onToggle={(e) =>
                          setAppendicesOpen(
                            (e.currentTarget as HTMLDetailsElement).open,
                          )
                        }
                      >
                        <summary className="nav-summary">{item.label}</summary>
                        <ul className="dropdown-menu">
                          {item.children.map((child) => (
                            <li key={child.to}>
                              <NavLink
                                to={child.to}
                                className={({ isActive }: { isActive: boolean }) =>
                                  isActive ? 'active-link' : undefined
                                }
                                onClick={handleNavClick}
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  )
                }

                return (
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
                )
              })}
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
