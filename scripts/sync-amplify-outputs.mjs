import { copyFileSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(new URL('../amplify_outputs.json', import.meta.url))
const destination = fileURLToPath(new URL('../public/amplify_outputs.json', import.meta.url))

if (existsSync(source)) {
  copyFileSync(source, destination)
} else if (process.env.AWS_BRANCH) {
  throw new Error('Amplify did not generate amplify_outputs.json for this branch.')
} else {
  rmSync(destination, { force: true })
  console.warn('No Amplify outputs found. Run `npm run sandbox` to connect a local backend.')
}