import { useState, useEffect, useCallback, useRef } from 'react'
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

  // Track whether a click-triggered scroll is in progress
  const isClickScrolling = useRef(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Scroll-spy via IntersectionObserver — suppressed during click scrolls
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return
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

  // Detect when click-triggered scroll finishes
  useEffect(() => {
    const onScroll = () => {
      if (!isClickScrolling.current) return
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => {
        isClickScrolling.current = false
      }, 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      isClickScrolling.current = true
      setActiveId(id)
      const top = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  if (headings.length < 2) return null

  // Get the two smallest distinct levels present (e.g. [1,2] or [2,3])
  const levels = [...new Set(headings.map((h) => h.level))].sort((a, b) => a - b)
  // Top two levels are always visible; deeper levels collapse
  const alwaysVisibleLevels = new Set(levels.slice(0, 2))

  // For each heading, find its nearest parent at an always-visible level
  const parentOfCollapsible: (number | null)[] = headings.map((h, i) => {
    if (alwaysVisibleLevels.has(h.level)) return null // not collapsible
    for (let j = i - 1; j >= 0; j--) {
      if (alwaysVisibleLevels.has(headings[j].level) && headings[j].level < h.level) return j
    }
    return null
  })

  // Find which always-visible parent the active heading belongs to
  const activeIdx = headings.findIndex((h) => h.id === activeId)
  let activeSection: number | null = null
  if (activeIdx !== -1) {
    if (alwaysVisibleLevels.has(headings[activeIdx].level)) {
      activeSection = activeIdx
    } else {
      activeSection = parentOfCollapsible[activeIdx]
    }
  }

  // A heading is visible if:
  // 1. It's at an always-visible level, OR
  // 2. Its parent section is the currently active section
  const isVisible = (index: number): boolean => {
    if (alwaysVisibleLevels.has(headings[index].level)) return true
    return parentOfCollapsible[index] === activeSection
  }

  return (
    <nav className="toc-sidebar" aria-label="Table of contents">
      <ul>
        {headings.map((h, i) => (
          <li
            key={h.id}
            className={`toc-level-${h.level}${activeId === h.id ? ' toc-active' : ''}${!isVisible(i) ? ' toc-hidden' : ''}`}
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
