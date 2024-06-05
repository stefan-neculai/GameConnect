import React, { useState, useEffect } from 'react';

interface Follower {
  id: string;
  username: string;
}

interface FollowersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const FollowersListModal: React.FC<FollowersListModalProps> = ({ isOpen, onClose, userId }) => {
  const [followers, setFollowers] = useState<Follower[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch followers from API
      fetch(`/api/users/${userId}/followers`)
        .then(response => response.json())
        .then(data => setFollowers(data))
        .catch(error => console.error('Error:', error));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Followers</h2>
        {followers.map(follower => (
          <div key={follower.id}>
            {follower.username}
          </div>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FollowersListModal;