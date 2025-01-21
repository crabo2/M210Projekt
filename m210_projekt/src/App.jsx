import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Movie from './Movie'

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
  const [movies, setMovies] = useState([]);

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

  // Filme aus der Datenbank abrufen
  const fetchMovies = async () => {
    if (session) {
      const { data, error } = await supabase
        .from('movie')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) {
        console.error('Fehler beim Abrufen der Filme:', error);
      } else {
        setMovies(data);
      }
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [session]);

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
        // Wenn null zurückgegeben wird, behandeln wir das hier, es gibt keinen Fehler.
        console.log('Erfolgreich hinzugefügt:', data);
        setMessage('Film erfolgreich hinzugefügt!');
        setMovieData({ name: '', releaseDate: '', description: '' });
        fetchMovies(); // Tabelle nach dem Hinzufügen aktualisieren
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
      
      <div className="movies-container">
        <h2>Alle Filme</h2>
        {movies.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Veröffentlichungsdatum</th>
                <th>Beschreibung</th>
                <th>Bewerten</th>
                <th>Bearbeiten</th>
                <th>Löschen</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <Movie key={movie.id} movie={movie} />
              ))}
            </tbody>
          </table>
        ) : (
          <p>Keine Filme vorhanden.</p>
        )}
      </div>

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
