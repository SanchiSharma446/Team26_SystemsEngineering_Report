import { useState, useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import TableOfContents from './TableOfContents';
import './MarkdownRenderer.css';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontFamily: 'Inter, sans-serif',
    primaryColor: '#eff6ff',
    primaryTextColor: '#1e293b',
    primaryBorderColor: '#2563eb',
    lineColor: '#64748b',
    secondaryColor: '#f8fafc',
    tertiaryColor: '#ffffff'
  }
});

function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      mermaid.render(id, chart).then((result) => {
        if (ref.current) ref.current.innerHTML = result.svg;
      }).catch((e: Error) => {
        console.error('Mermaid render error', e);
        if (ref.current) ref.current.innerHTML = `<pre class="mermaid-error">Error rendering diagram: ${e.message}</pre>`;
      });
    }
  }, [chart]);

  return <div className="mermaid-diagram" ref={ref} />;
}

function SequenceDiagram({ chart }: { chart: string }) {
  return (
    <details className="sequence-diagram" open={false}>
      <summary>Sequence Diagram</summary>
      <Mermaid chart={chart} />
    </details>
  );
}

interface MarkdownRendererProps {
  fileUrl: string;
  title?: string;
}

export default function MarkdownRenderer({ fileUrl, title }: MarkdownRendererProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch the document.');
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Content not found or coming soon...');
        setLoading(false);
      });
  }, [fileUrl]);

  const components: Components = {
    code(props: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
      const { children, className, ...rest } = props;
      // Handle the 'node' prop manually mapping to any to avoid unused prop
      const typedProps = props as any;
      if (typedProps.node) {
        // just access it to satisfy strictly configured linters if needed, or just delete it
      }

      const match = /language-(\w+)/.exec(className || '');
      if (match && match[1] === 'mermaid') {
        const chart = String(children).replace(/\n$/, '');
        const isSequenceDiagram = /^\s*sequenceDiagram\b/m.test(chart);

        if (isSequenceDiagram) {
          return <SequenceDiagram chart={chart} />;
        }

        return <Mermaid chart={chart} />;
      }
      return <code {...rest} className={className}>{children}</code>;
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="page-container">
      {title && <h1 className="page-title">{title}</h1>}
      <div className="page-layout">
        <TableOfContents contentRef={contentRef} contentKey={content} />
        <div className="content-card markdown-body" ref={contentRef}>
          {loading ? (
            <div className="loading-skeleton">Loading content...</div>
          ) : error ? (
            <div className="placeholder-content">
              <h2>{title || 'Section'} Placeholder</h2>
              <p>{error}</p>
              <p>This section is either under construction or currently missing from the documentation repository.</p>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
