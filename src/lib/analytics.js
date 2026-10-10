// Lightweight visitor analytics. Every view of a published portfolio or
// blog post is logged as an event; the dashboard Analytics view aggregates
// those events into totals, a daily trend, and a top-posts breakdown.

import { addDoc, listDocs } from './db'

const VISITOR_KEY = 'portfoliohub:visitor-id'

function visitorId() {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = Math.random().toString(36).slice(2, 12)
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

/** Log a page view. `type` is 'portfolio' or 'post'. */
export async function trackView(username, { type, postId = null, postTitle = null } = {}) {
  if (!username) return
  try {
    await addDoc('analytics_events', {
      username,
      type,
      postId,
      postTitle,
      visitorId: visitorId(),
      ts: new Date().toISOString(),
    })
  } catch {
    // Analytics is best-effort; never let a logging failure break the page.
  }
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

/** Aggregate all events for a portfolio owner into dashboard-ready stats. */
export async function getAnalyticsSummary(username) {
  const events = await listDocs('analytics_events', { username })

  const totalViews = events.length
  const portfolioViews = events.filter((e) => e.type === 'portfolio').length
  const postViews = events.filter((e) => e.type === 'post').length
  const uniqueVisitors = new Set(events.map((e) => e.visitorId)).size

  // Last 14 days trend, zero-filled.
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(isoDate(d))
  }
  const countsByDay = Object.fromEntries(days.map((d) => [d, 0]))
  events.forEach((e) => {
    const day = (e.ts || '').slice(0, 10)
    if (day in countsByDay) countsByDay[day] += 1
  })
  const trend = days.map((date) => ({ date, count: countsByDay[date] }))

  // Top posts by view count.
  const postCounts = {}
  events
    .filter((e) => e.type === 'post' && e.postId)
    .forEach((e) => {
      const key = e.postId
      postCounts[key] = postCounts[key] || { postId: key, title: e.postTitle || 'Untitled post', views: 0 }
      postCounts[key].views += 1
    })
  const topPosts = Object.values(postCounts).sort((a, b) => b.views - a.views).slice(0, 5)

  return { totalViews, portfolioViews, postViews, uniqueVisitors, trend, topPosts }
}
