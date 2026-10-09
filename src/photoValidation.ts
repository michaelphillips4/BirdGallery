export const MAX_PHOTO_SIZE_BYTES = 20 * 1024 * 1024

const supportedPhotoTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function validatePhotoFile(file: File): string | null {
  if (!supportedPhotoTypes.has(file.type)) {
    return 'Choose a JPEG, PNG, or WebP image.'
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return 'Choose an image smaller than 20 MB.'
  }

  return null
}