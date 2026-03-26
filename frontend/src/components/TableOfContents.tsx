import { useState, useEffect, useCallback } from 'react'
import type { RefObject } from 'react'
import './TableOfContents.css'

interface TocItem {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface TableOfContentsProps {
  contentRef: RefObject<HTMLElement | null>
  contentKey?: string // changes when content re-renders, triggering a re-scan
}

export default function TableOfContents({ contentRef, contentKey }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  // Scan DOM for headings
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const nodes = el.querySelectorAll('h1, h2, h3')
    const items: TocItem[] = []
    nodes.forEach((node) => {
      if (!node.id) {
        node.id = slugify(node.textContent || '')
      }
      items.push({
        id: node.id,
        text: node.textContent || '',
        level: parseInt(node.tagName[1]),
      })
    })
    setHeadings(items)
  }, [contentRef, contentKey])

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting (visible)
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
    }
  }, [])

  if (headings.length < 2) return null

  return (
    <nav className="toc-sidebar" aria-label="Table of contents">
      <ul>
        {headings.map((h) => (
          <li
            key={h.id}
            className={`toc-level-${h.level}${activeId === h.id ? ' toc-active' : ''}`}
          >
            <a href={`#${h.id}`} onClick={(e) => handleClick(e, h.id)}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
