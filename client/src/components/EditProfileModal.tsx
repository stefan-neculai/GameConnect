import React, { useState } from 'react';

interface EditProfileModalProps {
  onProfileSubmit: (profile: { bio: string, file: File | undefined }) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onProfileSubmit, onClose }) => {
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onProfileSubmit({ bio, file });
  };

  const handleFileChange = (e : any) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Bio:
          <textarea value={bio} onChange={e => setBio(e.target.value)} />
        </label>
        <label>
          Profile Picture:
          <input type="file" onChange={handleFileChange} accept="image/*"  />
        </label>
      </form>
      <button onClick={onClose}>Close</button>
      <button onClick={handleSubmit} type="submit"> Save changes </button>
    </>
  );
};

export default EditProfileModal;