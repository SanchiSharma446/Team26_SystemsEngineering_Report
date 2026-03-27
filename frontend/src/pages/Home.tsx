import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'
import {
  MessageSquare,
  CloudSun,
  Camera,
  Mail,
  MapPin,
  Cpu,
  Satellite,
  Sprout,
  ArrowRight,
  X,
} from 'lucide-react'
import dashboard from '../assets/dashboard.png'
import fullPage from '../assets/full_page.png'
import signIn from '../assets/sign_in_page.png'
import gantt from '../assets/gantt.png'
import uclLogo from '../assets/ucl.jpg'
import nttLogo from '../assets/ntt.png'
import azureLogo from '../assets/azure.svg'
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
  {
    name: 'Shuaiting Li',
    initials: 'SL',
    color: '#059669',
    role: 'Backend Architecture, Agent, CI/CD',
    email: 'shuaiting.li.23@ucl.ac.uk',
    github: 'https://github.com/shuaiting-li',
    linkedin: 'https://www.linkedin.com/in/shuaiting-li-7589a02b6/',
  },
  {
    name: 'Sagar Nair',
    initials: 'SN',
    color: '#0595ff',
    role: 'Frontend Testing, Shared UI Components',
    email: 'sagar.nair.24@ucl.ac.uk',
    github: 'https://github.com/IndigoSamurott',
    linkedin: 'https://www.linkedin.com/in/nairsagar/',
  },
  {
    name: 'Vivek Varkey',
    initials: 'VV',
    color: '#7c3aed',
    role: 'Frontend UI, Integrations',
    email: 'vivek.varkey.24@ucl.ac.uk',
    github: 'https://github.com/VivekVarkey5121',
    linkedin: 'https://www.linkedin.com/in/vivek-varkey-436600214/',
  },
  {
    name: 'Sanchi Sharma',
    initials: 'SS',
    color: '#dc2626',
    role: 'Drone Features, Account Management, Client Liaison',
    email: 'sanchi.sharma.24@ucl.ac.uk',
    github: 'https://github.com/SanchiSharma446',
    linkedin: 'https://www.linkedin.com/in/sanchi-sharma-8b7840265/',
  },
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

const partners = [
  { src: uclLogo, alt: 'UCL logo' },
  { src: nttLogo, alt: 'NTT DATA logo' },
  { src: azureLogo, alt: 'Microsoft Azure logo' },
]

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.586 2 12.256c0 4.53 2.865 8.373 6.839 9.73.5.095.682-.222.682-.494 0-.244-.009-.891-.014-1.749-2.782.624-3.369-1.374-3.369-1.374-.454-1.183-1.11-1.498-1.11-1.498-.907-.636.069-.623.069-.623 1.003.072 1.531 1.058 1.531 1.058.892 1.566 2.341 1.114 2.91.852.091-.666.349-1.114.635-1.37-2.221-.261-4.555-1.141-4.555-5.078 0-1.122.389-2.039 1.029-2.758-.103-.261-.446-1.312.098-2.736 0 0 .84-.276 2.75 1.053a9.2 9.2 0 0 1 2.504-.35c.849.004 1.705.12 2.504.35 1.909-1.329 2.748-1.053 2.748-1.053.546 1.424.203 2.475.1 2.736.64.719 1.028 1.636 1.028 2.758 0 3.947-2.338 4.814-4.566 5.07.359.317.679.941.679 1.897 0 1.369-.013 2.472-.013 2.809 0 .274.18.593.688.492C19.137 20.624 22 16.783 22 12.256 22 6.586 17.523 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.369-1.85 3.602 0 4.268 2.371 4.268 5.455v6.286ZM5.337 7.433a2.067 2.067 0 1 1 0-4.133 2.067 2.067 0 0 1 0 4.133ZM7.119 20.452H3.553V9h3.566v11.452Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Home() {
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)

  const expandedImageAlt = useMemo(() => {
    if (!expandedImage) return ''
    return expandedImage.alt
  }, [expandedImage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -4% 0px',
      },
    )

    const revealElements = document.querySelectorAll('.reveal-on-scroll')
    revealElements.forEach((el) => observer.observe(el))

    return () => {
      revealElements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!expandedImage) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedImage(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expandedImage])

  const revealStyle = (delay: number): CSSProperties => ({
    ['--reveal-delay' as string]: `${delay}ms`,
  })

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            <Sprout size={36} className="hero-title-icon" aria-hidden="true" />
            <span>Cresco</span>
          </h1>
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
          <span>Industry Exchange Network 2025/26</span>
          <div className="partner-divider" />
          <span>NTT DATA</span>
        </div>
      </div>

      {/* Abstract */}
      <section className="home-section">
        <h2 className="section-title">Abstract</h2>
        <div className="abstract-copy reveal-on-scroll">
          <p>
            Modern farming demands constant, complex decision-making, from crop planning and
            soil management to logistics, regulation, and unpredictable weather. Yet existing
            digital solutions are often costly, rigid, and built for large-scale operations,
            leaving smaller farms underserved.
          </p>
          <p>
            To address this, our team developed Cresco: a lightweight, agentic chatbot designed
            as an accessible daily assistant for precisely those small and medium-scale farms.
            Built on a cited RAG knowledge base, it answers queries on soil health, crop
            rotation, fertiliser use, and more. Farmers can define their farm boundary on an
            interactive map, enabling the system to pull real-time and forecasted weather data
            and ground the agent&apos;s advice in each farm&apos;s specific context. A toggleable web
            search keeps information current, and bulk document upload allows farmers to tailor
            the system to their own operations. There are also various drone and satellite
            imagery tools to allow farmers to attain quantitative data about the state of their
            farm. Rather than surface-level responses, Cresco delivers prioritised, actionable
            task lists with full source citations, which users can save for later.
          </p>
          <p>
            Cresco&apos;s modular architecture is designed for scalability, with clear pathways for
            more plug-and-play options down the line, allowing it to extend far beyond the
            classroom. Cresco was successfully developed, deployed, and handed over to NTT DATA. The final system supports NDVI, EVI, and SAVI extraction from multispectral drone imagery, real-time satellite integration via Copernicus Sentinel-2, and a fully containerised deployment on Azure. Feedback from the client at handover was positive, validating Cresco as a practical, foundation for accessible precision agriculture.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="home-section">
        <h2 className="section-title">Key Features</h2>
        <p className="section-subtitle">
          A comprehensive toolkit for modern small-scale farming
        </p>
        <div className="features-grid">
          {features.map((f, index) => (
            <div
              key={f.title}
              className="feature-card reveal-on-scroll"
              style={revealStyle(index * 80)}
            >
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
          {screenshots.map((s, index) => (
            <div
              key={s.label}
              className="screenshot-card reveal-on-scroll"
              style={revealStyle(index * 90)}
            >
              <img
                src={s.src}
                alt={s.label}
                className="expandable-image"
                role="button"
                tabIndex={0}
                onClick={() => setExpandedImage({ src: s.src, alt: s.label })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setExpandedImage({ src: s.src, alt: s.label })
                  }
                }}
              />
              <div className="screenshot-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Video */}
      <section className="home-section">
        <h2 className="section-title">Demo Video</h2>
        <p className="section-subtitle">Watch a walkthrough of Cresco in action</p>
        <div className="video-embed-wrapper" style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <iframe
            width="720"
            height="405"
            src="https://www.youtube.com/embed/bGYbpUUhR1E"
            title="Cresco Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ borderRadius: '12px', maxWidth: '100%' }}
          ></iframe>
        </div>
      </section>

      {/* Team */}
      <section className="home-section">
        <h2 className="section-title">Our Team</h2>
        <p className="section-subtitle">
          Four UCL Computer Science students
        </p>
        <div className="team-grid">
          {team.map((m, index) => (
            <div
              key={m.name}
              className="team-card reveal-on-scroll team-card-reveal"
              style={revealStyle(index * 120)}
            >
              <div className="team-avatar" style={{ backgroundColor: m.color }}>
                {m.initials}
              </div>
              <h3>{m.name}</h3>
              <div className="team-links">
                <a
                  href={`mailto:${m.email}`}
                  className="team-link"
                  aria-label={`Email ${m.name}`}
                >
                  <Mail size={16} />
                </a>
                <a
                  href={m.github}
                  className="team-link"
                  aria-label={`${m.name} GitHub profile`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon size={16} />
                </a>
                <a
                  href={m.linkedin}
                  className="team-link"
                  aria-label={`${m.name} LinkedIn profile`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Timeline */}
      <section className="home-section">
        <h2 className="section-title">Project Timeline</h2>
        <p className="section-subtitle">
          Development progress across the project lifecycle
        </p>
        <div className="gantt-placeholder reveal-on-scroll">
          <img
            src={gantt}
            alt="Cresco project timeline Gantt chart"
            className="gantt-image expandable-image"
            role="button"
            tabIndex={0}
            onClick={() => setExpandedImage({ src: gantt, alt: 'Cresco project timeline Gantt chart' })}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setExpandedImage({ src: gantt, alt: 'Cresco project timeline Gantt chart' })
              }
            }}
          />
        </div>
      </section>

      {/* Tech Stack */}
      <section className="home-section">
        <h2 className="section-title">Technology Stack</h2>
        <p className="section-subtitle">
          Built with modern, open-source technologies
        </p>
        <div className="tech-stack">
          {techStack.map((t, index) => (
            <span
              key={t}
              className="tech-badge reveal-on-scroll"
              style={revealStyle(index * 55)}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="home-section home-section-partners">
        <h2 className="section-title">Partners</h2>
        <div className="partners-row">
          {partners.map((partner, index) => (
            <div
              key={partner.alt}
              className="partner-logo-card reveal-on-scroll"
              style={revealStyle(index * 85)}
            >
              <img src={partner.src} alt={partner.alt} className="partner-logo" />
            </div>
          ))}
        </div>
      </section>

      {expandedImage ? (
        <div
          className="image-lightbox"
          role="dialog"
          aria-label={`Expanded image: ${expandedImageAlt}`}
          onClick={() => setExpandedImage(null)}
        >
          <button
            type="button"
            className="image-lightbox-close"
            aria-label="Close expanded image"
            onClick={(event) => {
              event.stopPropagation()
              setExpandedImage(null)
            }}
          >
            <X size={18} />
          </button>
          <img
            src={expandedImage.src}
            alt={expandedImage.alt}
            className="image-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}
