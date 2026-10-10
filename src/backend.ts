import { fetchAuthSession } from 'aws-amplify/auth'
import { generateClient } from 'aws-amplify/data'
import { getUrl, remove, uploadData } from 'aws-amplify/storage'
import imageCompression from 'browser-image-compression'
import type { Schema } from '../amplify/data/resource'
import { validatePhotoFile } from './photoValidation'

export type BirdPhoto = {
  id: string
  title: string
  species: string
  location: string
  date: string
  camera: string
  lens: string
  settings: string
  category: string
  notes: string
  imageKey: string
  image: string
}

export type PhotoInput = Omit<BirdPhoto, 'id' | 'image' | 'imageKey'>

const client = generateClient<Schema>()

export async function listPhotos(): Promise<BirdPhoto[]> {
  const { data, errors } = await client.models.Photo.list({ authMode: 'identityPool' })
  if (errors?.length) throw new Error(errors.map((error) => error.message).join(', '))

  return Promise.all(
    data.map(async (photo) => {
      const { url } = await getUrl({ path: photo.imageKey })
      return {
        id: photo.id,
        title: photo.title,
        species: photo.species ?? '',
        location: photo.location ?? '',
        date: photo.date ?? '',
        camera: photo.camera ?? '',
        lens: photo.lens ?? '',
        settings: photo.settings ?? '',
        category: photo.category,
        notes: photo.notes ?? '',
        imageKey: photo.imageKey,
        image: url.toString(),
      }
    }),
  )
}

export async function createPhoto(
  input: PhotoInput,
  file: File,
  onStatus: (message: string) => void,
): Promise<void> {
  const validationError = validatePhotoFile(file)
  if (validationError) throw new Error(validationError)

  onStatus('Preparing image and removing embedded metadata…')
  const sanitizedImage = await imageCompression(file, {
    fileType: 'image/webp',
    initialQuality: 0.88,
    maxSizeMB: 8,
    maxWidthOrHeight: 2400,
    preserveExif: false,
    useWebWorker: true,
    onProgress: (progress) => onStatus(`Preparing image… ${Math.round(progress)}%`),
  })
  if (sanitizedImage.size > 8 * 1024 * 1024) {
    throw new Error('The processed image is still larger than 8 MB.')
  }

  const imageKey = `photos/${crypto.randomUUID()}/photo.webp`
  onStatus('Uploading image to secure storage… 0%')
  await uploadData({
    path: imageKey,
    data: sanitizedImage,
    options: {
      contentType: 'image/webp',
      onProgress: ({ transferredBytes, totalBytes }) => {
        const progress = totalBytes ? Math.round((transferredBytes / totalBytes) * 100) : 0
        onStatus(`Uploading image to secure storage… ${progress}%`)
      },
    },
  }).result

  try {
    onStatus('Saving photo details…')
    const { errors } = await client.models.Photo.create(
      { ...input, imageKey },
      { authMode: 'userPool' },
    )
    if (errors?.length) throw new Error(errors.map((error) => error.message).join(', '))
  } catch (error) {
    await remove({ path: imageKey }).catch(() => undefined)
    throw error
  }
}

export async function deletePhoto(photo: BirdPhoto): Promise<void> {
  await remove({ path: photo.imageKey })
  const { errors } = await client.models.Photo.delete(
    { id: photo.id },
    { authMode: 'userPool' },
  )
  if (errors?.length) throw new Error(errors.map((error) => error.message).join(', '))
}

export async function isAdminUser(): Promise<boolean> {
  const session = await fetchAuthSession()
  const groups = session.tokens?.accessToken.payload['cognito:groups']
  return Array.isArray(groups) && groups.includes('Admins')
}