// File-upload abstraction. Cover images (and any other user upload) are
// compressed client-side, then handed to Firebase Storage when a project is
// configured, or kept as a data URL under a size-capped local cache
// otherwise. Either way callers just get back a URL string to use as
// `<img src>`.

import app, { isFirebaseConfigured } from './firebase'
import { compressImage, fileToDataUrl } from './imageCompression'
import { uid } from './localStore'

let storageMod = null
async function getStorage() {
  if (!storageMod) {
    const mod = await import('firebase/storage')
    storageMod = { storage: mod.getStorage(app), mod }
  }
  return storageMod
}

/**
 * Upload a file (e.g. a blog cover image) to `path` and return a usable URL.
 * `onProgress(percent)` is called for real Firebase uploads; for the local
 * mock backend it's invoked once at 100 since there's no network transfer.
 */
export async function uploadFile(path, file, { onProgress } = {}) {
  const compressed = await compressImage(file)

  if (isFirebaseConfigured) {
    const { storage, mod } = await getStorage()
    const fileRef = mod.ref(storage, `${path}/${uid()}-${compressed.name}`)
    const task = mod.uploadBytesResumable(fileRef, compressed)
    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snap) => {
          if (onProgress) onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
        },
        reject,
        async () => {
          const url = await mod.getDownloadURL(task.snapshot.ref)
          resolve(url)
        }
      )
    })
  }

  const dataUrl = await fileToDataUrl(compressed)
  if (onProgress) onProgress(100)
  return dataUrl
}
