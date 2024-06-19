import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ICommunity from '../types/Community';
import Modal from '../components/Modal';
import MakePostModal from '../components/MakePostModal';
import IPost from '../types/Post';
import { Link } from 'react-router-dom';
import './Community.css';
import PostUtils from '../utils/PostUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Community: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [community, setCommunity] = useState<ICommunity>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const { id } = useParams();
  const { user } = useAuth();
  const { timeSince, likePost, unlikePost, getPosts } = PostUtils();
  
  useEffect(() => {
    // Fetch posts from API
    const fetchPosts = async () => {
      const posts = await getPosts(page, limit, [id]);
      if (posts) {
        console.log(posts)
        setPosts(posts.posts);
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

  const handleLike = async (postId: string, event : any) => {
    event.stopPropagation();
    event.preventDefault();
    // use the likePost function from PostUtils
    const response = likePost(postId);
    console.log(response)
    if (response) {
      // Update the posts state
      setPosts(posts.map(post => {
        if (post._id === postId) {
          post.likedBy.push(user?.id || '');
        }
        return post;
      }));
    }
  }

  const handleUnlike = async (postId: string, event : any) => {
    event.stopPropagation();
    event.preventDefault();
    // use the unlikePost function from PostUtils
    const response = unlikePost(postId);
    console.log(response)
    if (response) {
      // Update the posts state
      setPosts(posts.map(post => {
        if (post._id === postId) {
          post.likedBy = post.likedBy.filter(id => id !== user?.id);
        }
        return post;
      }));
    }
  }

  if (!community) {
    return <div>Loading...</div>;
  }
  return (
    <div className="communityContainer">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MakePostModal onPostSubmit={handlePostSubmit} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <h1>{community.name}</h1>
      <button onClick={() => setIsModalOpen(true)}> Add Post </button>
      {posts && posts.map(post => (
        <Link to={`/post/${post._id}`}>
          <div key={post._id} className="postContainer">
            <div className="postAuthor">
              <img src={`https://localhost:4000/${post.author.profilePic}`} alt={post.author.username} />
              <p>{post.author.username}</p>
              <p> {timeSince(post.createdAt)}</p>
            </div>
            <h2>{post.title}</h2>
            {/* Display the post image if it exists */}
            {post?.photo && <img className="postPhoto" src={`https://localhost:4000/${post.photo}`} alt={post.title} />}
            <p>{post.content}</p>
            
            <p className='likes'>{post.likedBy.length} 
              <FontAwesomeIcon 
              icon={user && post.likedBy.includes(user.id)? faHeart : faHeartOutline }
              onClick={user && post.likedBy.includes(user.id)? (e) => handleUnlike(post._id, e) : (e) => handleLike(post._id, e)}
              /></p>
          </div>
        </Link>

       
      ))}
    </div>
  );
};

export default Community;