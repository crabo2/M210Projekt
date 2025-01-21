import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  if (!session) {
    return (
      <div className="auth-container">
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          providers={['google', 'github']}
        />
      </div>
    )
  }

  return (
    <div className="logged-in-container">
      <h1>Willkommen, {session.user.email}!</h1>
      <button
        onClick={async () => {
          const { error } = await supabase.auth.signOut()
          if (error) {
            console.error('Fehler beim Abmelden:', error.message)
          } else {
            alert('Erfolgreich abgemeldet!')
          }
        }}
        className="logout-button"
      >
        Abmelden
      </button>
    </div>
  )
}
