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
  const [movieData, setMovieData] = useState({
    name: '',
    releaseDate: '',
    description: ''
  });
  const [message, setMessage] = useState('');

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


  // Film hinzufügen
  const addNewMovie = async () => {
    if (!movieData.name || !movieData.releaseDate) {
      setMessage('Bitte alle Felder ausfüllen!');
      return;
    }

    try {
      const { data, error } = await supabase.from('movie').insert([
        {
          name: movieData.name,
          release_date: movieData.releaseDate,
          description: movieData.description,
          creator_id: session.user.id,
        },
      ]);

      if (error) {
        console.error('Fehler beim Hinzufügen des Films:', error);
        setMessage('Fehler beim Hinzufügen des Films: ' + error.message);
      } else {
        console.log('Erfolgreich hinzugefügt:', data);
        setMessage('Film erfolgreich hinzugefügt!');
        setMovieData({ name: '', releaseDate: '', description: '' });
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
      setMessage('Ein unerwarteter Fehler ist aufgetreten.');
    }
  };

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

      <div className="add-movie-container">
        <h2>Film hinzufügen</h2>
        <input
          type="text"
          placeholder="Name des Films"
          value={movieData.name}
          onChange={(e) => setMovieData({ ...movieData, name: e.target.value })}
        />
        <input
          type="date"
          value={movieData.releaseDate}
          onChange={(e) => setMovieData({ ...movieData, releaseDate: e.target.value })}
        />
        <textarea
          placeholder="Beschreibung des Films"
          value={movieData.description}
          onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
        />
        <button onClick={addNewMovie}>Hinzufügen</button>
        {message && <p>{message}</p>}
      </div>

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
