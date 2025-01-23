import './index.css';
import React, { useState } from 'react';
import { supabase } from './supabaseclient'; 

export default function Rating({ rating, onDelete, onUpdate, currentUserId }) {
  const [editableRating, setEditableRating] = useState(rating);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, field) => {
    setEditableRating({ ...editableRating, [field]: e.target.innerText });
  };

  const handleBlur = () => {
    onUpdate(rating.id, editableRating);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setEditableRating(rating);
    setIsEditable(false);
  };

  const isCreator = currentUserId === rating.creator_id;

  return (
    <tr className="rating-row">
      <td
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => handleChange(e, 'rating')}
      >
        {editableRating.rating}
      </td>
      <td
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => handleChange(e, 'comment')}
      >
        {editableRating.comment}
      </td>
      <td>
        <button onClick={() => setIsModalOpen(true)} className="rating-button">
          Bewertungen anzeigen
        </button>
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
          <button onClick={() => onDelete(rating.id)}>Löschen</button>
        ) : (
          <span>Nur der Ersteller kann löschen</span>
        )}
      </td>
    </tr>
  );
}
