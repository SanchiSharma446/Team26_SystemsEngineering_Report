import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Requirements', to: '/requirements' },
  { label: 'Research', to: '/research' },
  { label: 'UI Design', to: '/ui-design' },
  { label: 'System Design', to: '/system-design' },
  { label: 'Implementation', to: '/implementation' },
  { label: 'Testing', to: '/testing' },
  { label: 'Evaluation', to: '/evaluation' },
  { label: 'Appendices', to: '/appendices' },
]

function Header() {
  return (
    <header>
      <h1>My Portfolio</h1>
      <nav aria-label="Main navigation">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
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
    </header>
  )
}

export default Header