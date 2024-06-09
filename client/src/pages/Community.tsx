import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ICommunity from '../types/Community';
import Modal from '../components/Modal';
import MakePostModal from '../components/MakePostModal';
import IPost from '../types/Post';
import { Link } from 'react-router-dom';


const Community: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [community, setCommunity] = useState<ICommunity>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  
  useEffect(() => {
    // Fetch posts from API
    const fetchPosts = async () => {
      const response = await fetch(`https://localhost:4000/api/posts`,
        {
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
    fetchPosts();
  }, []);

  const handlePostSubmit = async (post: { title: string; content: string; postImage: File | undefined }) => {
    // Submit post to API
    const payload = new FormData();
    payload.append('title', post.title);
    payload.append('content', post.content);
    if(id)
      payload.append('community', id);
    if(user) {
      payload.append('userId', user.id);
      payload.append('username', user.username);
      payload.append('profilePic', user.profilePicture || '');
    }
    if(post.postImage) {
      payload.append('photo', post.postImage);
    }
    const response = await fetch('https://localhost:4000/api/posts/create', {
      method: 'POST',
      credentials: 'include', // Ensure cookies are sent with the request
      body: payload
    });

      if (response.ok) {
        setIsModalOpen(false)
        const data = await response.json();
        setPosts([...posts, data]);
      }
  }
  if (!community) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MakePostModal onPostSubmit={handlePostSubmit} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <h1>{community.name}</h1>
      <button onClick={() => setIsModalOpen(true)}> Add Post </button>
      {posts.map(post => (
        <Link to={`/post/${post._id}`}>
        <div key={post._id}>
          <h2>{post.title}</h2>
          {/* Display the post image if it exists */}
          {post?.photo && <img src={`https://localhost:4000/${post.photo}`} alt={post.title} />}
          <p>{post.content}</p>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default Community;