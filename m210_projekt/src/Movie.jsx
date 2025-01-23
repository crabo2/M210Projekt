import './index.css';
import React, { useState } from 'react';
import Ratings from './Ratings';

export default function Movie({ movie, onDelete, onUpdate, currentUserId, session }) {
  const [editableMovie, setEditableMovie] = useState(movie);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, field) => {
    setEditableMovie({ ...editableMovie, [field]: e.target.innerText });
  };

  const handleBlur = () => {
    onUpdate(movie.id, editableMovie);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setEditableMovie(movie);
    setIsEditable(false);
  };

  const handleRatingSubmit = (movieId, rating) => {
    console.log(`Film ID: ${movieId}, Bewertung: ${rating}`);
  };

  const isCreator = currentUserId === movie.creator_id;

  return (
    <tr className="movie-row">
      <td
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => handleChange(e, 'name')}
      >
        {editableMovie.name}
      </td>
      <td
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => handleChange(e, 'release_date')}
      >
        {editableMovie.release_date}
      </td>
      <td
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => handleChange(e, 'description')}
      >
        {editableMovie.description}
      </td>
      <td>
        <button onClick={() => setIsModalOpen(true)} className="rating-button">
          Bewertungen
        </button>
        <Ratings
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          movieId={movie.id}
          userId={session?.user?.id}
        />
      </td>
      <td>
        {isCreator ? (
          isEditable ? (
            <button onClick={handleCancelClick}>Abbrechen</button>
          ) : (
            <button onClick={handleEditClick}>Anpassen</button>
          )
        ) : (
          <span>Nur der Ersteller kann bearbeiten</span>
        )}
      </td>
      <td>
        {isCreator ? (
          <button onClick={() => onDelete(movie.id)}>Löschen</button>
        ) : (
          <span>Nur der Ersteller kann löschen</span>
        )}
      </td>
    </tr>
  );
}
