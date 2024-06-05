import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User } from '../types/User';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import EditProfileModal from '../components/EditProfileModal';
import { useParams } from 'react-router-dom';
import { Game } from '../types/Game';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';


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

  const handleSubmit = async (profile: { bio: string, profilePic : File | undefined, banner : File | undefined}) => {
    if (profile) {
      const formData = new FormData();
      formData.append('bio', profile.bio);
      if (profile.profilePic) {
        formData.append('profilePicture', profile.profilePic);
      }
      if (profile.banner) {
        formData.append('banner', profile.banner);
      }
      const response = await fetch('http://localhost:4000/api/user/update/' + id, {
        method: 'PUT',
        credentials: 'include', // Ensure cookies are sent with the request
        body: formData
      });

      if (response.ok) {
        console.log('User updated successfully');
        setModalOpen(false);
      }
    }
  };


  const followUser = async () => {
    if (user) {
      const response = await fetch(`http://localhost:4000/api/user/follow/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if(response.ok) { 
        console.log('User followed successfully');
      }
    }
  };

  const unfollowUser = async () => {
    if (user) {
      const response = await fetch(`http://localhost:4000/api/user/unfollow/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if(response.ok) { 
        console.log('User unfollowed successfully');
      }
    }
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  const defaultPicURL = "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg";
  return (
    <div className="profilePage">
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <EditProfileModal onProfileSubmit={handleSubmit} onClose={() => setModalOpen(false)}/>
      </Modal>
      <img className="banner" src={userData.banner? "http://localhost:4000/" + userData.banner : defaultPicURL}/>
      <div className="profileHeader">
        <img className="profilePicture" src={userData.profilePicture? "http://localhost:4000/" + userData.profilePicture : defaultPicURL}/>
        <div className="profileHeaderRight">
          <div className="profileHeaderTopRight">
            <h2>{userData.username}</h2>
            {id === user?.id && <button onClick={() => setModalOpen(true)}> Edit Profile </button>}
            {user && userData.followers.includes(user.id)?
              <button onClick={unfollowUser}> Unfollow </button>
              : id !== user?.id && <button onClick={followUser}> Follow </button>}
          </div>
          <div className="userCounts">
            <p> {userData.followers.length} followers </p>
            <p> {userData.follows.length} following </p>
            <p> 20 posts </p>
          </div>
          <p>{userData.bio}</p>
        </div>
      </div>


      {favoriteGames.length === 0 && <p>No favorite games yet</p>}
      {favoriteGames.length > 0 && 
      <div className="favoriteGames">
        <h2>Favorite Games</h2>
        <div className="favoriteGamesList">
          {favoriteGames.map(game => (
            <Link to={`/game/${game._id}`} key={game._id}>
              <div key={game._id} className="favoriteGame">
                <img src={`//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/')[7]}`} alt="Game Cover" />
                <p>{game.name}</p>
              </div>
            </Link>

          ))}
        </div>
      </div>}
    </div>
  );
};

export default Profile;
