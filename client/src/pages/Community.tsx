import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ICommunity from '../types/Community';
import Modal from '../components/Modal';
import MakePostModal from '../components/MakePostModal';
import IPost from '../types/Post';
import './Community.css';
import Posts from '../components/Posts';
import { usePosts } from '../context/PostsContext';

const Community: React.FC = () => {
  const [community, setCommunity] = useState<ICommunity>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { setPage, setPosts, setTotal, setOrder } = usePosts();
  
  useEffect(() => {
    const fetchCommunity = async () => {
      const response = await fetch(`https://localhost:4000/api/community/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Ensure cookies are sent with the request
        });
      if (response.ok) {
        const data = await response.json();
        setCommunity(data);
      }
    }

      fetchCommunity();
      setPage(1);
      setPosts([]);
      setTotal(0);
  }, []);

  const onSuccesfulPost = () => {
    console.log("succesful post")
    setIsModalOpen(false);
    setOrder('new');
  }

  if (!community) {
    return <div>Loading...</div>;
  }
  return (
    <div className="communityContainer">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MakePostModal onClose={onSuccesfulPost} />
      </Modal>
      <h1>{community.name}</h1>
      <button onClick={() => setIsModalOpen(true)}> Add Post </button>
      <Posts communityIds={[id? id : '']}/>
    </div>
  );
};

export default Community;

