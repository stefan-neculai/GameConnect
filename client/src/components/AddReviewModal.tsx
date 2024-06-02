import React, { useState } from 'react';
import './AddReviewModal.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmit: (review: { rating: number; content: string }) => void;
}

const AddReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onReviewSubmit({ rating, content });
    onClose(); // Close modal after submit
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Add a Review</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="1" max="10" />
          </label>
          <label>
            Review:
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          </label>
          <button type="submit">Submit Review</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;

// Add some basic styles in your CSS file for modalOverlay and modalContent
