/**
 * Smooth-scroll to an in-page element by id without letting the browser
 * touch the URL hash. Plain `href="#id"` anchors would work under
 * BrowserRouter but break app navigation under HashRouter (the app's
 * routes themselves live in the hash), so every in-page anchor link
 * (nav sections, table-of-contents entries) uses this instead.
 */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
