import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mb-4 border-b border-dark-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mb-3 mt-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-white mb-2 mt-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 mb-3 leading-relaxed">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-bold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-neon-blue italic">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 leading-relaxed">
              {children}
            </li>
          ),
          code: ({ inline, children }) => (
            inline ? (
              <code className="bg-dark-bg text-neon-green px-1 py-0.5 rounded text-sm">
                {children}
              </code>
            ) : (
              <code className="block bg-black/50 text-neon-green p-3 rounded-lg text-sm overflow-x-auto">
                {children}
              </code>
            )
          ),
          pre: ({ children }) => (
            <pre className="bg-black/50 border border-gray-700 rounded-lg p-4 mb-4 overflow-x-auto">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-neon-purple pl-4 italic text-gray-400 mb-3">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neon-blue hover:text-blue-400 underline transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};