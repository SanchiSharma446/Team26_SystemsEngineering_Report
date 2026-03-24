import { NavLink } from 'react-router-dom'
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
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="site-title">
          Team 26 Systems Engineering
        </NavLink>
        <nav aria-label="Main navigation" className="main-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive ? 'active-link' : undefined
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header