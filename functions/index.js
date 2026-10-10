// Cloud Functions for PortfolioHub. Deploy with `firebase deploy --only functions`
// once your project is on the Blaze (pay-as-you-go) plan, which Cloud Functions
// requires. These are optional server-side conveniences — the app fully works
// against Firestore/Storage/Auth directly without them.

import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { logger } from 'firebase-functions'

initializeApp()
const db = getFirestore()

/**
 * Fires whenever a visitor submits the public contact form. In production,
 * plug in your email provider of choice (Resend, SendGrid, Nodemailer + SMTP)
 * to notify the portfolio owner immediately instead of them having to check
 * the dashboard inbox.
 */
export const onContactMessageCreated = onDocumentCreated('messages/{messageId}', async (event) => {
  const message = event.data?.data()
  if (!message) return

  logger.info('New portfolio contact message', {
    toUsername: message.toUsername,
    from: message.email,
  })

  // TODO: look up the owner's notification email from their profile and
  // send it via your email provider, e.g.:
  //
  // const profileSnap = await db
  //   .collection('profiles')
  //   .where('username', '==', message.toUsername)
  //   .limit(1)
  //   .get()
  // const ownerEmail = profileSnap.docs[0]?.data()?.notificationEmail
  // await sendEmail({ to: ownerEmail, subject: `New message from ${message.name}`, ... })
})

/**
 * Fires on every analytics view event and maintains a running view-count
 * aggregate on the post document itself, so the public blog list can show
 * view counts without the client having to scan the whole events collection.
 */
export const onAnalyticsEventCreated = onDocumentCreated('analytics_events/{eventId}', async (event) => {
  const data = event.data?.data()
  if (!data || data.type !== 'post' || !data.postId) return

  await db
    .collection('posts')
    .doc(data.postId)
    .set({ viewCount: FieldValue.increment(1) }, { merge: true })
})
