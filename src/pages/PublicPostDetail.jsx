import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDoc, listDocs } from '../lib/db'
import { getTheme, themeToCssVars } from '../data/themes'
import { trackView } from '../lib/analytics'
import { useAuth } from '../context/AuthContext'
import PostDetail from '../components/blog/PostDetail'
import NotFound from './NotFound'

export default function PublicPostDetail() {
  const { username, slug } = useParams()
  const { user } = useAuth()
  const [state, setState] = useState({ loading: true, profile: null, post: null })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        // See PublicPortfolio.jsx: an unfiltered query can't be proven
        // against the "published || owner" rule, so it must ask only for
        // published profiles; an owner's own (possibly unpublished) profile
        // is fetched separately by uid.
        const published = await listDocs('profiles', { username, published: true })
        let profile = published[0] || null

        if (!profile && user) {
          const own = await getDoc('profiles', user.uid)
          if (own && own.username === username) profile = own
        }

        if (!profile) {
          if (!cancelled) setState({ loading: false, profile: null, post: null })
          return
        }

        const isOwner = user?.uid === profile.id
        const posts = isOwner
          ? await listDocs('posts', { authorId: profile.id, slug })
          : await listDocs('posts', { authorId: profile.id, slug, status: 'published' })
        const post = posts.find((p) => isOwner || p.status === 'published') || null
        if (!cancelled) setState({ loading: false, profile, post })
        if (post) trackView(username, { type: 'post', postId: post.id, postTitle: post.title })
      } catch (err) {
        console.error('Failed to load public post:', err)
        if (!cancelled) setState({ loading: false, profile: null, post: null })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username, slug, user])

  if (state.loading) return null
  if (!state.profile || !state.post) return <NotFound />

  const theme = getTheme(state.profile.theme)

  return (
    <div style={themeToCssVars(theme)}>
      <PostDetail post={state.post} username={username} authorName={state.profile.displayName} />
    </div>
  )
}
