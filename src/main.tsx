import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function configureBackend() {
  try {
    const response = await fetch('/amplify_outputs.json', { cache: 'no-store' })
    if (!response.ok) return false
    const outputs = await response.json()
    const { Amplify } = await import('aws-amplify')
    Amplify.configure(outputs)
    return true
  } catch {
    return false
  }
}

void configureBackend().then((backendConfigured) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App backendConfigured={backendConfigured} />
    </StrictMode>,
  )
})
