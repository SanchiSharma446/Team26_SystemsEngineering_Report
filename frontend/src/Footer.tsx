import { NavLink } from 'react-router-dom'

const docLinks = [
  { label: 'Requirements', to: '/requirements' },
  { label: 'Research', to: '/research' },
  { label: 'UI Design', to: '/ui-design' },
  { label: 'System Design', to: '/system-design' },
  { label: 'Implementation', to: '/implementation' },
  { label: 'Testing', to: '/testing' },
  { label: 'Evaluation', to: '/evaluation' },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-column">
          <h3>Cresco</h3>
          <p>AI-powered agricultural advisory system for small-scale UK farmers.</p>
          <p className="footer-programme">UCL COMP0016 &mdash; IXN 2024/25</p>
        </div>
        <div className="footer-column">
          <h3>Documentation</h3>
          <ul>
            {docLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li><a href="https://www.ucl.ac.uk/computer-science/" target="_blank" rel="noopener noreferrer">UCL Computer Science</a></li>
            <li><a href="https://www.nttdata.com/" target="_blank" rel="noopener noreferrer">NTT DATA</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} Team 26 &mdash; UCL Computer Science. All Rights Reserved.</p>
        <p>Built with React, Vite &amp; TypeScript.</p>
      </div>
    </footer>
  )
}

export default Footer
