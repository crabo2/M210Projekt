
export default function Movie(movies) {
    {movies && movies.length > 0 ? (
        movies.map((movie) => (
          <tr key={movie.id}>
            <td>
              {editingmovie === movie.id ? (
                <input
                  type="text"
                  defaultValue={movie.name}
                  onChange={(e) => setNewmovie(e.target.value)}
                />
              ) : (
                movie.name
              )}
            </td>
            <td>
              {editingmovie === movie.id ? (
                <>
                  <button onClick={() => updatemovie(movie.id, newmovie)}>Speichern</button>
                  <button onClick={() => setEditingmovie(null)}>Abbrechen</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditingmovie(movie.id)}>Bearbeiten</button>
                  <button onClick={() => deletemovie(movie.id)}>Löschen</button>
                </>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="2">Keine Länder gefunden.</td>
        </tr>
      )}
}