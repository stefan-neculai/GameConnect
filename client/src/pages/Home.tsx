import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import Posts from '../components/Posts';
import BreadcrumbNavigator from '../components/BreadcrumbNavigator';
import './Home.css';
const Home: React.FC = () => {
  const { user } = useAuth();
  const { setPage, setPosts, setTotal } = usePosts();
  
  useEffect(() => {
     setPage(1);
     setPosts([]);
     setTotal(0);
  }, [user]);

  if(user?.communities)
    return (
      <div className="homeContainer">
        <h1> Home </h1>
        <Posts communityIds={user?.communities}/>
      </div>
    );
  
  return ( 
    <div>Loading...</div>
  );
};

export default Home;
