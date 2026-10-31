// Rules shared by import-videos.mjs and validate-videos.mjs (service-page YouTube videos).

export const VIDEO_ID = /^[\w-]{11}$/
export const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`

// The ID from a youtu.be or youtube.com/watch link, or null for anything else.
export function youtubeId(url) {
  let u
  try {
    u = new URL(url)
  } catch {
    return null
  }
  if (u.protocol !== 'https:') return null
  const id = u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.hostname === 'www.youtube.com' && u.pathname === '/watch' ? u.searchParams.get('v') : null
  return id && VIDEO_ID.test(id) ? id : null
}

// Outcome claims the content rules keep off the site; a video title shown on a page must not carry them.
export const BANNED_CLAIMS = /\b(best|guaranteed?|permanent(ly)?|painless|no side effects?|scarless|100%)/i
