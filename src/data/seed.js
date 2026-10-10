// Seeds one demo portfolio (username "alex-demo") into the local mock
// backend on every load, so the "View a sample portfolio" link on the home
// page — and the blog module's TOC / syntax highlighting / reading-progress
// features — have something real to show without anyone signing up first.
// Upserts by fixed id (never touches a visitor's own data), so an edit to
// the content below reaches browsers that already loaded an older version.
// Only touches localStorage; has no effect when a real Firebase project is
// configured.

import { localCollection } from '../lib/localStore'
import { isFirebaseConfigured } from '../lib/firebase'
import { readingTimeMinutes } from '../lib/toc'

const DEMO_UID = 'demo-alex-uid'

const DEMO_POST_BODY = `Six months ago I couldn't tell you what a closure was. Today I shipped my
first full-stack app end to end — auth, a database, and a deploy pipeline.
Here's what actually moved the needle.

## Start with one real project, not ten tutorials

Tutorials feel productive because you're always making progress. But typing
along to someone else's code doesn't build the muscle you need when the
error message is yours alone to solve. I stalled for months bouncing
between courses until I picked one project — a portfolio site, actually —
and refused to touch a new tutorial until it shipped.

### Pick something with a deadline

Give yourself a real deadline, even an artificial one. "I'll apply to five
jobs with this portfolio by Friday" beats "I'll get to it eventually" every
time.

## Read error messages like they're trying to help you

They are. Here's the loop that got me unstuck more than anything else:

\`\`\`javascript
function readingTime(markdown) {
  const words = markdown.trim().split(/\\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

console.log(readingTime("some blog post body here"));
\`\`\`

Paste the exact error, read the file and line number it points to, and
resist the urge to guess. Nine times out of ten the fix is smaller than it
looks.

### Keep a running log

I kept a plain markdown file of every bug I hit and how I fixed it. Three
months in, it had become my own personal Stack Overflow — searchable, and
written in language I actually understood.

## Ship something publicly, even if it's small

| Milestone | What I shipped | Time spent |
|---|---|---|
| Week 2 | Static portfolio, no backend | 6 hrs |
| Week 6 | Added a working contact form | 4 hrs |
| Week 10 | Blog with Markdown rendering | 9 hrs |
| Week 14 | Deployed with a real database | 12 hrs |

A live link, however rough, does more for your confidence — and your
résumé — than another finished course ever will.

## What I'd tell myself on day one

- Build one thing all the way through before starting another
- Commit to git from day one, even solo — it's a habit worth having early
- Ask "what is this error actually telling me" before searching for the fix
- Deploy early; a live broken app teaches you more than a perfect local one

If you're in the middle of this right now: you're closer than it feels.
`

const DEMO_PROFILE = {
  id: DEMO_UID,
  displayName: 'Surya',
  title: 'Frontend Developer & CS Student',
  bio: 'Final-year CS student who loves building small, useful tools. Currently looking for junior frontend / full-stack roles.',
  username: 'alex-demo',
  avatarUrl: '',
  theme: 'ocean',
  published: true,
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: '',
    website: '',
  },
  skills: [
    { id: 's1', category: 'Languages', name: 'JavaScript', level: 4 },
    { id: 's2', category: 'Languages', name: 'Python', level: 3 },
    { id: 's3', category: 'Languages', name: 'TypeScript', level: 3 },
    { id: 's4', category: 'Frameworks', name: 'React', level: 4 },
    { id: 's5', category: 'Frameworks', name: 'Tailwind CSS', level: 4 },
    { id: 's6', category: 'Tools', name: 'Git & GitHub', level: 4 },
    { id: 's7', category: 'Tools', name: 'Firebase', level: 3 },
  ],
  createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
}

const DEMO_PROJECTS = [
  {
    id: 'demo-project-1',
    authorId: DEMO_UID,
    title: 'PortfolioHub',
    description: 'This portfolio builder itself — React, Firebase, and a Markdown-powered blog.',
    repoUrl: 'facebook/react',
    liveUrl: '',
    stars: null,
    forks: null,
    language: 'JavaScript',
    order: 0,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'demo-project-2',
    authorId: DEMO_UID,
    title: 'Weather CLI',
    description: 'A tiny command-line weather lookup written while learning Node and public APIs.',
    repoUrl: 'nodejs/node',
    liveUrl: '',
    stars: null,
    forks: null,
    language: 'JavaScript',
    order: 1,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
]

const DEMO_POSTS = [
  {
    id: 'demo-post-1',
    authorId: DEMO_UID,
    title: 'What actually helped me go from tutorials to shipping',
    body: DEMO_POST_BODY,
    coverImageUrl: '',
    tags: ['career', 'learning', 'webdev'],
    status: 'published',
    readingTime: readingTimeMinutes(DEMO_POST_BODY),
    slug: 'tutorials-to-shipping',
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
]

export function seedDemoData() {
  if (isFirebaseConfigured) return
  try {
    // Always upsert the fixed-id demo records (never a returning visitor's
    // own data) so an edit to this file reaches browsers that already
    // seeded an older version, not just first-time visitors.
    localCollection.upsert('profiles', DEMO_UID, DEMO_PROFILE)
    DEMO_PROJECTS.forEach((p) => localCollection.upsert('projects', p.id, p))
    DEMO_POSTS.forEach((p) => localCollection.upsert('posts', p.id, p))
  } catch {
    // Best-effort demo seeding — never block the app from starting.
  }
}
