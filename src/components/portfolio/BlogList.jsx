import { Link } from 'react-router-dom'
import { markdownExcerpt } from '../../lib/text'

/** Published posts, most recent first — the public Blog List section. */
export default function BlogList({ posts, username }) {
  const published = [...posts]
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))

  if (published.length === 0) return null

  return (
    <section id="blog" className="mx-auto max-w-4xl px-6 py-14">
      <h2 className="mb-6 text-2xl font-bold" style={{ color: 'var(--ph-text)' }}>
        Blog
      </h2>
      <div className="space-y-4">
        {published.map((post) => (
          <Link
            key={post.id}
            to={`/p/${username}/blog/${post.slug}`}
            className="flex gap-4 rounded-xl border p-4 transition hover:shadow-md sm:gap-5 sm:p-5"
            style={{ borderColor: 'var(--ph-border)', background: 'var(--ph-surface)' }}
          >
            {post.coverImageUrl ? (
              <img
                src={post.coverImageUrl}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg object-cover sm:h-24 sm:w-36"
              />
            ) : (
              <div
                className="grid h-20 w-28 shrink-0 place-items-center rounded-lg text-2xl sm:h-24 sm:w-36"
                style={{ background: 'var(--ph-surface-alt)' }}
              >
                📝
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold" style={{ color: 'var(--ph-text)' }}>
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm" style={{ color: 'var(--ph-muted)' }}>
                {markdownExcerpt(post.body)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--ph-muted)' }}>
                <span>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>·</span>
                <span>{post.readingTime} min read</span>
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5"
                    style={{ background: 'var(--ph-surface-alt)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
