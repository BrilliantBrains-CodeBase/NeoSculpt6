// Shrinks a scalp photo before it is sent with the hair assessment (src/components/assessment/AssessmentWizard.tsx):
// long edge at most 1568 px (the size the AI reads images at, so nothing is lost) and JPEG, which keeps three photos
// near 1 MB in total. Redrawing on a canvas also drops the camera's EXIF data, GPS location included. Browsers apply
// the EXIF rotation when decoding, so the photo stays the right way up.

const MAX_EDGE = 1568
const QUALITY = 0.82
export const MAX_INPUT_BYTES = 20 * 1024 * 1024

export interface ResizedPhoto {
  /** JPEG bytes as base64, without the data: prefix. */
  base64: string
  /** For the on-page preview. */
  dataUrl: string
  width: number
  height: number
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file)
    } catch {
      // fall through to <img>, which some browsers decode more formats with
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function resizePhoto(file: File): Promise<ResizedPhoto> {
  const source = await decode(file)
  const w0 = 'naturalWidth' in source ? source.naturalWidth : source.width
  const h0 = 'naturalHeight' in source ? source.naturalHeight : source.height
  if (!w0 || !h0) throw new Error('empty image')
  const scale = Math.min(1, MAX_EDGE / Math.max(w0, h0))
  const width = Math.round(w0 * scale)
  const height = Math.round(h0 * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('no canvas')
  ctx.drawImage(source, 0, 0, width, height)
  if ('close' in source) source.close()
  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)
  return { base64: dataUrl.slice(dataUrl.indexOf(',') + 1), dataUrl, width, height }
}
