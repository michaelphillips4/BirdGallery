import type { ReactNode } from 'react'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { isAdminUser } from './backend'
import { useEffect, useState } from 'react'

function AdminGate({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuthenticator((context) => [context.user])
  const [authorization, setAuthorization] = useState<{ username: string; isAdmin: boolean } | null>(null)

  useEffect(() => {
    let cancelled = false
    isAdminUser()
      .then((result) => { if (!cancelled) setAuthorization({ username: user?.username ?? '', isAdmin: result }) })
      .catch(() => { if (!cancelled) setAuthorization({ username: user?.username ?? '', isAdmin: false }) })
    return () => { cancelled = true }
  }, [user?.username])

  const isAdmin = authorization?.username === user?.username ? authorization.isAdmin : null
  if (isAdmin === null) return <p className="empty-state">Checking administrator access…</p>
  if (!isAdmin) return <div className="demo-notice"><p>This account is not in the Cognito Admins group.</p><button className="manage-button" type="button" onClick={() => void signOut()}>Sign out</button></div>
  return <><div className="admin-session"><span>Signed in as {user?.username}</span><button className="manage-button" type="button" onClick={() => void signOut()}>Sign out</button></div>{children}</>
}

export default function AdminAuthentication({ children }: { children: ReactNode }) {
  return <Authenticator hideSignUp><AdminGate>{children}</AdminGate></Authenticator>
}