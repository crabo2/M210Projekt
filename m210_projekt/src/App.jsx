import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseclient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Movie from './Movie'

export default function App() {
  const [session, setSession] = useState(null)
  const [movieData, setMovieData] = useState({
    name: '',
    releaseDate: '',
    description: ''
  });
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

  // Film anpassen
  const updateMovie = async (movieId, updatedMovieData) => {
    try {
      const { data, error } = await supabase
        .from('movie')
        .update(updatedMovieData)
        .match({ id: movieId });

      if (error) {
        console.error('Fehler beim Aktualisieren des Films:', error);
      } else {
        console.log('Film erfolgreich aktualisiert:', data);
        fetchMovies(); // Tabelle nach dem Aktualisieren erneut abrufen
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
    }
  };

  // Film löschen
  const deleteMovie = async (movieId) => {
    try {
      const { data, error } = await supabase
        .from('movie')
        .delete()
        .match({ id: movieId });

      if (error) {
        console.error('Fehler beim Löschen des Films:', error);
      } else {
        console.log('Erfolgreich gelöscht:', data);
        fetchMovies(); // Tabelle nach dem Löschen erneut abrufen
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
    }
  };

  // Film hinzufügen
  const addNewMovie = async () => {
    if (!movieData.name || !movieData.releaseDate) {
      alert('Bitte alle Felder ausfüllen!');
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
      } else {
        console.log('Film erfolgreich hinzugefügt:', data);
        setMovieData({ name: '', releaseDate: '', description: '' });
        fetchMovies(); // Tabelle nach dem Hinzufügen aktualisieren
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
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
                <th>Alle Bewertungen</th>
                <th>Bearbeiten</th>
                <th>Löschen</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <Movie
                key={movie.id}
                movie={movie}
                onDelete={deleteMovie}
                onUpdate={updateMovie}
                currentUserId={session.user.id}
                session={session}
              />              
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
