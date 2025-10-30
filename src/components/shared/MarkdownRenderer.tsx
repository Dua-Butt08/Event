import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export function MarkdownRenderer({ content, className = '', inline = false }: MarkdownRendererProps) {
  const markdownJsx = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold text-[var(--text)] mb-6 mt-8 first:mt-0 border-b border-[var(--border)] pb-3">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-8 first:mt-0 text-[var(--accent)]">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold text-[var(--text)] mb-3 mt-6">{children}</h3>,
        h4: ({ children }) => <h4 className="text-lg font-semibold text-[var(--text)] mb-2 mt-4">{children}</h4>,
        p: ({ children }) => <p className="text-[var(--text)] mb-4 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside text-[var(--text)] mb-6 space-y-2 ml-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside text-[var(--text)] mb-6 space-y-2 ml-4">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (<blockquote className="border-l-4 border-[var(--accent)] pl-6 my-6 italic text-[var(--muted)]">{children}</blockquote>),
        code: ({ children }) => (<code className="bg-[var(--bg-elev)] px-2 py-1 rounded text-sm font-mono border border-[var(--border)]">{children}</code>),
        pre: ({ children }) => (<pre className="bg-[var(--bg-elev)] p-4 rounded-lg border border-[var(--border)] overflow-x-auto">{children}</pre>),
        table: ({ children }) => (<div className="overflow-x-auto my-6"><table className="w-full border-collapse border border-[var(--border)] rounded-lg">{children}</table></div>),
        th: ({ children }) => (<th className="border border-[var(--border)] px-4 py-3 bg-[var(--accent)]/10 font-semibold text-left">{children}</th>),
        td: ({ children }) => (<td className="border border-[var(--border)] px-4 py-3">{children}</td>),
        strong: ({ children }) => <strong className="font-bold text-[var(--accent)]">{children}</strong>,
        em: ({ children }) => <em className="italic text-[var(--accent-2)]">{children}</em>,
        a: ({ children, href }) => (<a href={href} className="text-[var(--accent)] hover:text-[var(--accent-2)] underline transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>),
        hr: () => <hr className="border-[var(--border)] my-8" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );

  if (inline) {
    return markdownJsx;
  }

  return (
    <div className={`prose prose-lg prose-invert max-w-none ${className}`}>
      {markdownJsx}
    </div>
  );
}
