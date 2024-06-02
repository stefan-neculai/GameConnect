import React, { useState } from 'react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileSubmit: (profile: { bio: string }) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onProfileSubmit }) => {
  const [bio, setBio] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onProfileSubmit({ bio });
    onClose(); // Close modal after submit
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Bio:
            <textarea value={bio} onChange={e => setBio(e.target.value)} />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;