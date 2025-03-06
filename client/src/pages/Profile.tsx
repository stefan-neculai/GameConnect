import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User } from '../types/User';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import EditProfileModal from '../components/EditProfileModal';
import { useParams } from 'react-router-dom';
import { Game } from '../types/Game';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import Followers from '../components/Followers';
import Following from '../components/Following';
import Chat from '../components/Chat';


const Profile: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFollowersModalOpen, setFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/user/` + id, {
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
      const response = await fetch(`${API_URL}/games/favorite/${id}`, {
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

    const fetchPosts = async () => {
      const response = await fetch(`${API_URL}/posts/author/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    }

    fetchData();
    fetchPosts();
    fetchFavoriteGames();

  }, [id]);

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
      const response = await fetch(`${API_URL}/user/update/` + id, {
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


  const followUser = async (id : string | undefined) => {
    if (user) {
      const response = await fetch(`${API_URL}/user/follow/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if(response.ok && userData) { 
        setUserData({...userData, followers: [...userData?.followers, user._id]});
        console.log('User followed successfully');
      }
    }
  };

  const unfollowUser = async (id : string | undefined) => {
    if (user) {
      const response = await fetch(`${API_URL}/user/unfollow/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if(response.ok && userData) { 
        setUserData({...userData, followers: userData?.followers.filter(follower => follower !== user._id)});
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
      <Modal isOpen={isFollowersModalOpen} onClose={() => setFollowersModalOpen(false)}>
        <Followers followUser={followUser} unfollowUser={unfollowUser} onClose={() => setFollowersModalOpen(false)}/>
      </Modal>
      <Modal isOpen={isFollowingModalOpen} onClose={() => setFollowingModalOpen(false)}>
        <Following followUser={followUser} unfollowUser={unfollowUser} onClose={() => setFollowingModalOpen(false)}/>
      </Modal>
      <Modal isOpen={isChatOpen} onClose={() => setChatOpen(false)}>
        <Chat receiver={userData} />
      </Modal>
      <img className="banner" src={userData.banner? "https://localhost:4000/" + userData.banner : defaultPicURL}/>
      <div className="profileHeader">
        <img className="profilePicture" src={userData.profilePicture? "https://localhost:4000/" + userData.profilePicture : defaultPicURL}/>
        <div className="profileHeaderRight">
          <div className="profileHeaderTopRight">
            <h2>{userData.username}</h2>
            {id === user?._id && <button onClick={() => setModalOpen(true)}> Edit Profile </button>}
            {user && userData.followers.includes(user._id)?
              <button onClick={() => unfollowUser(id)}> Unfollow </button>
              : id !== user?._id && <button onClick={() => followUser(id)}> Follow </button>}
            {id && user?._id && user._id != id && userData.followers.includes(user?._id) && userData.follows.includes(user?._id) && <button onClick={() => setChatOpen(true)}> Message </button>}
          </div>
          <div className="userCounts">
            <p onClick={() => setFollowersModalOpen(true)}> {userData.followers.length} followers </p>
            <p onClick={() => setFollowingModalOpen(true)}> {userData.follows.length} following </p>
            <p> {posts.length} posts </p>
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
