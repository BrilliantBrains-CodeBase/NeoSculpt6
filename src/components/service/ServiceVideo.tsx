import { useEffect, useRef, useState } from 'react'
import type { ServiceVideo as Video } from '../../data/services/types'
import { SmartLink } from '../SmartLink'
import { PlayIcon } from '../icons'
import { eyebrow } from '../shared'

// A service page's YouTube video, under the consultation text (content/service/prompts/service-youtube-video-section.md).
// Click to load: until the visitor presses play the frame shows the local thumbnail and nothing is requested from
// YouTube; the press swaps in a youtube-nocookie player that starts at once (it never starts on its own) and moves
// focus to it. The 16:9 frame is in the prerendered HTML, so nothing shifts. "Watch on YouTube" stays below as the
// fallback when the player is blocked. Not in the theme: its closest pieces are the 20px rounded media and the
// rose circular control of the before/after handle.

export function ServiceVideo({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const headingId = `service-video-${video.videoId}`

  useEffect(() => {
    if (playing) frameRef.current?.focus()
  }, [playing])

  return (
    <div role="group" aria-labelledby={headingId} className="flex w-full flex-col gap-[15px]">
      <p className={eyebrow}>Watch the Explanation</p>
      <h3 id={headingId} className="text-[18px] leading-[1.4] font-medium text-secondary">
        {video.title}
      </h3>
      {video.description && <p>{video.description}</p>}

      <div className="relative mt-[5px] aspect-video w-full overflow-hidden rounded-[20px] border border-border bg-alternate">
        {playing ? (
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${video.title}`}
            className="group absolute inset-0 flex cursor-pointer items-center justify-center focus-visible:outline-none"
          >
            {video.thumbnail && (
              <img
                src={video.thumbnail.src}
                width={video.thumbnail.width}
                height={video.thumbnail.height}
                alt={video.thumbnail.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <span aria-hidden="true" className="absolute inset-0 bg-alternate/25" />
            {/* Focus ring inside the frame: an outline would be clipped by the rounded corners. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-[20px] ring-primary ring-inset group-focus-visible:ring-4"
            />
            <span
              aria-hidden="true"
              className="relative flex size-[64px] items-center justify-center rounded-full bg-primary text-alternate transition-colors duration-300 group-hover:bg-accent group-hover:text-secondary group-focus-visible:bg-accent group-focus-visible:text-secondary md:size-[76px]"
            >
              <PlayIcon className="size-5 translate-x-[2px] md:size-6" />
            </span>
          </button>
        )}
      </div>

      <SmartLink
        href={video.url}
        className="inline-flex items-center gap-2.5 self-start text-small text-text underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline"
      >
        <PlayIcon className="size-3 shrink-0 text-primary" />
        Watch on YouTube
        <span className="sr-only"> (opens in a new tab)</span>
      </SmartLink>
    </div>
  )
}
