import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User } from '../types/User';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import EditProfileModal from '../components/EditProfileModal';
import { useParams } from 'react-router-dom';
import { Game } from '../types/Game';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/api/user/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    };

    const fetchFavoriteGames = async () => {
      const response = await fetch(`http://localhost:4000/api/games/favorite/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setFavoriteGames(data);
      }
    }

    fetchData();
    fetchFavoriteGames();
    
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (profile: { bio: string }) => {
    if (profile) {
      // Here you should update the user data with the new profile picture
      const response = await fetch('http://localhost:4000/api/user/update/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify(profile)
      });

      if(response.ok) { 
        console.log('User updated successfully');
      }

      setEditing(false);
    }
  };
  

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profilePage">
      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)}
        onProfileSubmit={handleSubmit}
      />

      <div className="profileHeader">
        <img src="https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"/>
        <div className="profileHeaderRight">
          <div className="profileHeaderTopRight">
            <h2>{userData.username}</h2>
            {id === user?.id && <button onClick={() => setModalOpen(true)}> Edit Profile </button>}
          </div>
          <p>{userData.email}</p>
          <p>{userData.bio}</p>
        </div>
      </div>


      {favoriteGames.length === 0 && <p>No favorite games yet</p>}
      {favoriteGames.length > 0 && 
      <div className="favoriteGames">
        <h2>Favorite Games</h2>
        <div className="favoriteGamesList">
          {favoriteGames.map(game => (
            <div key={game._id} className="favoriteGame">
              <img src={`//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/')[7]}`} alt="Game Cover" />
              <p>{game.name}</p>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default Profile;
