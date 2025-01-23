import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseclient';

export default function Ratings({ isOpen, onClose, movieId, userId }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState({ rating: '', text: '' });
  const [editRatingId, setEditRatingId] = useState(null); // ID der Bewertung, die bearbeitet wird
  const [editRatingData, setEditRatingData] = useState({ rating: '', text: '' }); // Daten der zu bearbeitenden Bewertung

  // Bewertungen abrufen
  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('rating')
        .select()
        .eq('m_id', movieId);

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

  // Neue Bewertung hinzufügen
  const addNewRating = async () => {
    if (!newRating.rating || !newRating.text) {
      alert('Bitte beide Felder ausfüllen!');
      return;
    }

    try {
      const { data, error } = await supabase.from('rating').insert([
        {
          rating: newRating.rating,
          text: newRating.text,
          m_id: movieId,
          creator_id: userId,
        },
      ]);

      if (error) {
        console.error('Fehler beim Hinzufügen der Bewertung:', error.message);
      } else {
        console.log('Bewertung erfolgreich hinzugefügt:', data);
        setNewRating({ rating: '', text: '' });
        fetchRatings();
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
    }
  };

  // Bewertung bearbeiten
  const updateRating = async () => {
    if (!editRatingData.rating || !editRatingData.text) {
      alert('Bitte beide Felder ausfüllen!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('rating')
        .update({
          rating: editRatingData.rating,
          text: editRatingData.text,
        })
        .eq('id', editRatingId);

      if (error) {
        console.error('Fehler beim Aktualisieren der Bewertung:', error.message);
      } else {
        console.log('Bewertung erfolgreich aktualisiert:', data);
        setEditRatingId(null);
        setEditRatingData({ rating: '', text: '' });
        fetchRatings();
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
    }
  };

  // Bewertung löschen
  const deleteRating = async (ratingId) => {
    try {
      const { error } = await supabase.from('rating').delete().eq('id', ratingId);

      if (error) {
        console.error('Fehler beim Löschen der Bewertung:', error.message);
      } else {
        console.log('Bewertung erfolgreich gelöscht');
        fetchRatings();
      }
    } catch (err) {
      console.error('Unerwarteter Fehler:', err);
    }
  };

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
              {ratings.map((rating) => {
                const isCreator = rating.creator_id === userId; // Prüfen, ob der aktuelle Benutzer der Ersteller ist
                return (
                  <tr key={rating.id}>
                    <td>{rating.rating}</td>
                    <td>{rating.text}</td>
                    <td>
                      {isCreator ? (
                        <button
                          onClick={() => {
                            setEditRatingId(rating.id);
                            setEditRatingData({ rating: rating.rating, text: rating.text });
                          }}
                        >
                          Bearbeiten
                        </button>
                      ) : (
                        <span>Nur der Ersteller kann bearbeiten</span>
                      )}
                    </td>
                    <td>
                      {isCreator ? (
                        <button onClick={() => deleteRating(rating.id)}>Löschen</button>
                      ) : (
                        <span>Nur der Ersteller kann löschen</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Keine Bewertungen gefunden.</p>
        )}

        {editRatingId ? (
          <div>
            <h3>Bewertung bearbeiten</h3>
            <input
              type="number"
              placeholder="Bewertung"
              value={editRatingData.rating}
              onChange={(e) => setEditRatingData({ ...editRatingData, rating: e.target.value })}
              min="1"
              max="10"
            />
            <textarea
              placeholder="Kommentar"
              value={editRatingData.text}
              onChange={(e) => setEditRatingData({ ...editRatingData, text: e.target.value })}
            />
            <button onClick={updateRating}>Aktualisieren</button>
            <button onClick={() => setEditRatingId(null)}>Abbrechen</button>
          </div>
        ) : (
          <div>
            <h3>Neue Bewertung hinzufügen</h3>
            <input
              type="number"
              placeholder="Bewertung"
              value={newRating.rating}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value >= 1 && value <= 10) {
                  setNewRating({ ...newRating, rating: value });
                } else if (!e.target.value) {
                  setNewRating({ ...newRating, rating: '' });
                }
              }}
              min="1"
              max="10"
            />
            <textarea
              placeholder="Kommentar"
              value={newRating.text}
              onChange={(e) => setNewRating({ ...newRating, text: e.target.value })}
            />
            <button onClick={addNewRating}>Hinzufügen</button>
          </div>
        )}

        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
}
