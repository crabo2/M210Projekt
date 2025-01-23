import './index.css';
import React, { useState } from 'react';

export default function Rating({ rating, onDelete, onUpdate, currentUserId }) {
  const [editableRating, setEditableRating] = useState(rating);
  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (e, field) => {
    setEditableRating({ ...editableRating, [field]: e.target.innerText });
  };

  const handleBlur = () => {
    onUpdate(rating.id, editableRating);
    setIsEditable(false); // Verlassen des Bearbeitungsmodus nach dem Speichern
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setEditableRating(rating); // Änderungen verwerfen
    setIsEditable(false); // Bearbeitungsmodus verlassen
  };

  // Prüfen, ob der aktuelle Benutzer der Ersteller ist
  const isCreator = currentUserId === rating.creator_id;

  return (
    <tr className="rating-row">
      {/* Bewertungsfeld */}
      <td
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => handleChange(e, 'rating')}
      >
        {editableRating.rating}
      </td>

      {/* Kommentarfeld */}
      <td
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => handleChange(e, 'comment')}
      >
        {editableRating.comment}
      </td>

      {/* Bearbeiten-/Abbrechen-Schaltflächen */}
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

      {/* Löschen-Schaltfläche */}
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
