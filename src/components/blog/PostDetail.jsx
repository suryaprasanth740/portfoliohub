import { Link } from 'react-router-dom'
import { extractToc } from '../../lib/toc'
import MarkdownRenderer from './MarkdownRenderer'
import TableOfContents from './TableOfContents'
import ReadingProgressBar from './ReadingProgressBar'

export default function PostDetail({ post, username, authorName }) {
  const toc = extractToc(post.body)

  return (
    <div style={{ background: 'var(--ph-bg)', color: 'var(--ph-text)' }} className="min-h-screen">
      <ReadingProgressBar />

      {post.coverImageUrl && (
        <div className="h-56 w-full overflow-hidden sm:h-72">
          <img src={post.coverImageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          to={`/p/${username}`}
          className="mb-6 inline-block text-sm hover:underline"
          style={{ color: 'var(--ph-primary)' }}
        >
          ← Back to {authorName}'s portfolio
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <article>
            <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">{post.title}</h1>
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--ph-muted)' }}>
              <span>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
              {post.tags?.length > 0 && (
                <>
                  <span>·</span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{ background: 'var(--ph-surface-alt)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <MarkdownRenderer content={post.body} />
          </article>

          <aside className="hidden lg:block">
            <TableOfContents toc={toc} />
          </aside>
        </div>
      </div>
    </div>
  )
}
