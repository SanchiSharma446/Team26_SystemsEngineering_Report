import { NavLink } from 'react-router-dom'
import {
  MessageSquare,
  CloudSun,
  Camera,
  MapPin,
  Cpu,
  Satellite,
  ArrowRight,
  Clock,
} from 'lucide-react'
import dashboard from '../assets/dashboard.png'
import fullPage from '../assets/full_page.png'
import signIn from '../assets/sign_in_page.png'
import './Home.css'

const features = [
  {
    icon: MessageSquare,
    title: 'RAG-Powered Chat',
    description:
      'Conversational AI grounded in agricultural knowledge bases with source citations and structured task outputs.',
  },
  {
    icon: CloudSun,
    title: 'Weather Integration',
    description:
      '5-day forecast with temperature and wind charts, contextualised to the farmer\'s location.',
  },
  {
    icon: Camera,
    title: 'Drone Image Analysis',
    description:
      'Upload paired RGB and NIR drone images to compute NDVI, EVI, and SAVI vegetation indices.',
  },
  {
    icon: MapPin,
    title: 'Interactive Farm Map',
    description:
      'Leaflet-based map with polygon farm boundaries, geocoding, and location-aware advisory.',
  },
  {
    icon: Cpu,
    title: 'Multi-LLM Support',
    description:
      'Five providers supported — Azure OpenAI, OpenAI, Google, Anthropic, and Ollama — switchable via config.',
  },
  {
    icon: Satellite,
    title: 'Satellite NDVI',
    description:
      'Copernicus Sentinel-2 satellite imagery for vegetation health monitoring at farm coordinates.',
  },
]

const team = [
  { name: 'Shuaiting Li', initials: 'SL', color: '#2563eb', role: 'Backend Architecture, Agent, CI/CD' },
  { name: 'Sagar', initials: 'S', color: '#059669', role: 'Frontend Testing, Shared UI Components' },
  { name: 'Vivek Varkey', initials: 'VV', color: '#7c3aed', role: 'Frontend UI, Integrations' },
  { name: 'Sanchi', initials: 'S', color: '#dc2626', role: 'Drone Features, Account Management' },
]

const techStack = [
  'React',
  'FastAPI',
  'LangGraph',
  'ChromaDB',
  'PostgreSQL',
  'Docker',
  'Azure',
]

const screenshots = [
  { src: dashboard, label: 'Dashboard' },
  { src: fullPage, label: 'Chat Interface' },
  { src: signIn, label: 'Sign In' },
]

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Cresco</h1>
          <p className="hero-tagline">AI-Powered Agricultural Advisory for UK Farmers</p>
          <p className="hero-subtitle">
            An affordable, open-source AI assistant helping small-scale UK farmers make
            better decisions — powered by RAG, weather data, and drone imagery analysis.
          </p>
          <NavLink to="/requirements" className="hero-cta">
            Explore the Project <ArrowRight size={18} />
          </NavLink>
        </div>
      </section>

      {/* Partner Bar */}
      <div className="partner-bar">
        <div className="partner-bar-inner">
          <span>UCL COMP0016</span>
          <div className="partner-divider" />
          <span>Industry Exchange Network 2024/25</span>
          <div className="partner-divider" />
          <span>NTT DATA</span>
        </div>
      </div>

      {/* Features */}
      <section className="home-section">
        <h2 className="section-title">Key Features</h2>
        <p className="section-subtitle">
          A comprehensive toolkit for modern small-scale farming
        </p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <f.icon size={32} className="feature-icon" />
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots */}
      <section className="home-section" style={{ background: 'var(--color-bg)' }}>
        <h2 className="section-title">Application Preview</h2>
        <p className="section-subtitle">
          A glimpse of Cresco's interface
        </p>
        <div className="screenshots-grid">
          {screenshots.map((s) => (
            <div key={s.label} className="screenshot-card">
              <img src={s.src} alt={s.label} />
              <div className="screenshot-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="home-section">
        <h2 className="section-title">Our Team</h2>
        <p className="section-subtitle">
          Four UCL Computer Science students
        </p>
        <div className="team-grid">
          {team.map((m) => (
            <div key={m.name} className="team-card">
              <div className="team-avatar" style={{ backgroundColor: m.color }}>
                {m.initials}
              </div>
              <h3>{m.name}</h3>
              <p className="team-role">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gantt Chart Placeholder */}
      <section className="home-section">
        <h2 className="section-title">Project Timeline</h2>
        <p className="section-subtitle">
          Development progress across the project lifecycle
        </p>
        <div className="gantt-placeholder">
          <Clock size={40} />
          <p>Project timeline coming soon</p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="home-section">
        <h2 className="section-title">Technology Stack</h2>
        <p className="section-subtitle">
          Built with modern, open-source technologies
        </p>
        <div className="tech-stack">
          {techStack.map((t) => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
        </div>
      </section>
    </div>
  )
}
