import React, { useState } from 'react';
import './EditProfileModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';

interface EditProfileModalProps {
  onProfileSubmit: (profile: { bio: string, profilePic: File | undefined, banner: File | undefined }) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onProfileSubmit, onClose }) => {
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePicture] = useState<File | undefined>();
  const [banner, setBanner] = useState<File | undefined>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onProfileSubmit({ bio, profilePic, banner });
  };

  const handleProfilePicChange = (e : any) => {
    console.log(e.target.files[0])
    setProfilePicture(e.target.files[0]);
  };

  const handleBannerChange = (e : any) => {
    console.log(e.target.files[0])
    setBanner(e.target.files[0]);
  };

  return (
    <div className="editProfileModal">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="editProfileForm">
        <label>
          Bio:
          
        </label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} />
        <label>
          Profile Picture:
        </label>
        <label htmlFor="profilePic" className="profilePicLabel">
        <FontAwesomeIcon icon={faFileArrowUp} /> {profilePic?.name || 'Upload'}        
        </label>
        <input id="profilePic" type="file" onChange={handleProfilePicChange} accept="image/*"  />
        <label>
          Banner:
        </label>
        <label htmlFor="banner" className="bannerLabel">
        <FontAwesomeIcon icon={faFileArrowUp} />{banner?.name || 'Upload'}      
        </label>
        <input id="banner" type="file" onChange={handleBannerChange} accept="image/*"  />
      </form>
      <div className="modalControls">
        <button onClick={onClose}>Close</button>
        <button onClick={handleSubmit} type="submit"> Submit changes </button>
      </div>

    </div>
  );
};

export default EditProfileModal;