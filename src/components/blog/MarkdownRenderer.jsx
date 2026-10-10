import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

/**
 * Renders a post's Markdown body with GitHub-flavored Markdown, syntax
 * highlighting on all code blocks (rehype-highlight + highlight.js), and
 * an id on every heading (rehype-slug) so the Table of Contents sidebar's
 * anchor links land in the right place.
 */
export default function MarkdownRenderer({ content }) {
  return (
    <div className="ph-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  )
}
