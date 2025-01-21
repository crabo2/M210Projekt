import React from 'react';

export default function Movie({ movie, onRate, onEdit, onDelete }) {
  return (
    <tr className="movie-row">
      <td>{movie.name}</td>
      <td>{movie.release_date}</td>
      <td>{movie.description}</td>
      <td><button onClick={() => onRate(movie.id)}>Bewerten</button></td>
      <td><button onClick={() => onEdit(movie.id)}>Anpassen</button></td>
      <td><button onClick={() => onDelete(movie.id)}>Löschen</button></td>
    </tr>
  );
}
