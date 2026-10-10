// Tiny localStorage-backed "collection" helper used by the mock backend
// (db.js, storage.js, auth.js) when no Firebase project is configured.
// Each collection is a JSON array of records keyed by `id`, stored under
// `portfoliohub:<collection>`.

const PREFIX = 'portfoliohub:'

function read(collection) {
  try {
    const raw = localStorage.getItem(PREFIX + collection)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(collection, records) {
  localStorage.setItem(PREFIX + collection, JSON.stringify(records))
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export const localCollection = {
  all(collection) {
    return read(collection)
  },
  get(collection, id) {
    return read(collection).find((r) => r.id === id) || null
  },
  query(collection, predicate) {
    return read(collection).filter(predicate)
  },
  insert(collection, record) {
    const records = read(collection)
    const withId = { id: record.id || uid(), ...record }
    records.push(withId)
    write(collection, records)
    return withId
  },
  update(collection, id, patch) {
    const records = read(collection)
    const idx = records.findIndex((r) => r.id === id)
    if (idx === -1) return null
    records[idx] = { ...records[idx], ...patch, id }
    write(collection, records)
    return records[idx]
  },
  upsert(collection, id, record) {
    const records = read(collection)
    const idx = records.findIndex((r) => r.id === id)
    if (idx === -1) {
      const withId = { id, ...record }
      records.push(withId)
      write(collection, records)
      return withId
    }
    records[idx] = { ...records[idx], ...record, id }
    write(collection, records)
    return records[idx]
  },
  remove(collection, id) {
    const records = read(collection).filter((r) => r.id !== id)
    write(collection, records)
  },
}

export { uid }
