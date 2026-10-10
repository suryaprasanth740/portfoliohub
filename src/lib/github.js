// Live GitHub star counts for the Projects Showcase, via the public GitHub
// REST API (unauthenticated, 60 requests/hour per IP). Results are cached
// in localStorage for an hour so re-rendering the dashboard or portfolio
// doesn't burn through the rate limit.

const CACHE_KEY = 'portfoliohub:github-cache'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}
  } catch {
    return {}
  }
}

function writeCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

/** Parse "owner/repo" or a full github.com URL into { owner, repo }. */
export function parseRepo(input) {
  if (!input) return null
  const trimmed = input.trim().replace(/\/$/, '')
  const urlMatch = /github\.com\/([^/]+)\/([^/]+)/i.exec(trimmed)
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '') }
  const shortMatch = /^([\w.-]+)\/([\w.-]+)$/.exec(trimmed)
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] }
  return null
}

/**
 * Fetch live repo stats (stars, forks, description, language) for a repo
 * identified by "owner/repo" or a full GitHub URL. Returns null on any
 * failure (private repo, rate limit, bad input, offline) so callers can
 * fall back to showing the project without live stats.
 */
export async function fetchRepoStats(input) {
  const parsed = parseRepo(input)
  if (!parsed) return null
  const key = `${parsed.owner}/${parsed.repo}`.toLowerCase()

  const cache = readCache()
  const cached = cache[key]
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${key}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return cached ? cached.data : null
    const json = await res.json()
    const data = {
      stars: json.stargazers_count ?? 0,
      forks: json.forks_count ?? 0,
      language: json.language || null,
      description: json.description || '',
      htmlUrl: json.html_url,
      updatedAt: json.pushed_at,
    }
    cache[key] = { fetchedAt: Date.now(), data }
    writeCache(cache)
    return data
  } catch {
    return cached ? cached.data : null
  }
}
