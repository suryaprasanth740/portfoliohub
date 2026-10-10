import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteDoc, listDocs } from '../../lib/db'

export default function BlogEditor() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const list = await listDocs('posts', { authorId: user.uid })
    list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    setPosts(list)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function remove(id) {
    await deleteDoc('posts', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Blog</h1>
        <Link
          to="new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + New post
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading posts…</p>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">
          No posts yet. Write your first devlog to see it appear on your public blog.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              {post.coverImageUrl ? (
                <img src={post.coverImageUrl} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="grid h-14 w-20 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-300">
                  📝
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link to={post.id} className="truncate font-semibold text-slate-900 hover:text-indigo-600">
                    {post.title || 'Untitled post'}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                  <span>{post.readingTime || 1} min read</span>
                  {post.tags?.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="truncate">{post.tags.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  to={post.id}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(post.id)}
                  className="rounded-md px-2 py-1.5 text-xs text-slate-300 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
