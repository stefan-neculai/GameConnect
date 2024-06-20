import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import IPost from '../types/Post';
import { Link } from 'react-router-dom';
import './Community.css'; // Assuming you use the same styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { User } from '../types/User';
import { usePosts } from '../context/PostsContext';
import Posts from '../components/Posts';

const Home: React.FC = () => {
  const [userData, setUser] = useState<User>(); // [1
  const { user } = useAuth();
  const { setPage, setPosts, setTotal } = usePosts();
  
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`https://localhost:4000/api/user/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUser(data);
      }
    }

     fetchUser();
     setPage(1);
     setPosts([]);
     setTotal(0);
  }, [user]);

  if(userData)
    return (
      <div className="communityContainer">
        <h1>Your Communities' Posts</h1>
        <Posts communityIds={userData?.communities}/>
      </div>
    );
  
  return ( 
    <div>Loading...</div>
  );
};

export default Home;
