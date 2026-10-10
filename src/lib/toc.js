import GithubSlugger from 'github-slugger'

/**
 * Extract an H2/H3 table of contents from raw Markdown.
 * Uses the same slugging algorithm (github-slugger) as the rehype-slug
 * plugin applied when rendering the post body, so generated ids like
 * `#getting-started` match between the TOC links and the rendered headings.
 */
export function extractToc(markdown = '') {
  const slugger = new GithubSlugger()
  const lines = markdown.split('\n')
  const toc = []
  let inCodeFence = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith('```') || line.startsWith('~~~')) {
      inCodeFence = !inCodeFence
      continue
    }
    if (inCodeFence) continue

    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line)
    if (!match) continue

    const depth = match[1].length // 2 = H2, 3 = H3
    const text = match[2].replace(/[*_`]/g, '').trim()
    if (!text) continue

    toc.push({ depth, text, id: slugger.slug(text) })
  }

  return toc
}

export function readingTimeMinutes(markdown = '') {
  const words = markdown
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
