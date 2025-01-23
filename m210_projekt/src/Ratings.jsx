// Ratings.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseclient';

export default function Ratings({ isOpen, onClose }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
 

  // Bewertungen abrufen
  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('rating')
        .select();

      if (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error.message);
      } else {
        setRatings(data);
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  // Bewertungen beim Öffnen des Modals laden
  useEffect(() => {
    if (isOpen) {
      fetchRatings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bewertungen</h2>

        {loading ? (
          <p>Lade Bewertungen...</p>
        ) : ratings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Bewertung</th>
                <th>Kommentar</th>
                <th>Bearbeiten</th>
                <th>Löschen</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id}>
                  <td>{rating.rating}</td>
                  <td>{rating.text}</td>
                  <td>
                    <button
                      onClick={() => updateRating(rating.id, { rating: 5, text: 'Aktualisiert' })}
                    >
                      Bearbeiten
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deleteRating(rating.id)}>Löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Keine Bewertungen gefunden.</p>
        )}
      </div>
    </div>
  );
}
