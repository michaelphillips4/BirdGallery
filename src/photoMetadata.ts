import * as exifr from 'exifr'

export type PhotoMetadata = {
  camera?: string
  lens?: string
  settings?: string
  location?: string
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(1)))
}

export async function readPhotoMetadata(file: File): Promise<PhotoMetadata> {
  const [tags, gps] = await Promise.all([
    exifr.parse(file, ['Make', 'Model', 'LensModel', 'FNumber', 'ExposureTime', 'ISO', 'FocalLength']),
    exifr.gps(file),
  ])
  const metadata: PhotoMetadata = {}

  const make = textValue(tags?.Make)
  const model = textValue(tags?.Model)
  let camera = ''
  if (make && model) {
    camera = model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`
  } else {
    camera = model || make
  }
  if (camera) metadata.camera = camera

  const lens = textValue(tags?.LensModel)
  if (lens) metadata.lens = lens

  const exposureTime = numberValue(tags?.ExposureTime)
  const fNumber = numberValue(tags?.FNumber)
  const iso = numberValue(tags?.ISO)
  const focalLength = numberValue(tags?.FocalLength)
  const settings: string[] = []
  if (exposureTime !== undefined && exposureTime > 0) {
    settings.push(exposureTime < 1 ? `1/${Math.round(1 / exposureTime)} sec` : `${formatNumber(exposureTime)} sec`)
  }
  if (fNumber !== undefined) settings.push(`f/${formatNumber(fNumber)}`)
  if (iso !== undefined) settings.push(`ISO ${formatNumber(iso)}`)
  if (focalLength !== undefined) settings.push(`${formatNumber(focalLength)}mm`)
  if (settings.length) metadata.settings = settings.join(' · ')

  if (gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)) {
    metadata.location = `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`
  }

  return metadata
}
