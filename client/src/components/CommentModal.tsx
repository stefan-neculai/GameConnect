import React, { useState } from 'react';
import './CommentModal.css';
import { useParams } from 'react-router-dom';

interface CommentModalProps {
  onCommentSubmit: (comment: { content: string }) => void;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ onCommentSubmit, onClose }) => {
  const [content, setContent] = useState('');
  const { id } = useParams();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCommentSubmit({ content });
  };

  return (
    <div className="commentModal">
      <div className="modalContent">
        <h2>Add Comment</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Comment:
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
          </label>
          <div className="modalControls">
            <button onClick={onClose}>Close</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
