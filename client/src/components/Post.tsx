import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Post.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import IPost from '../types/Post';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';


interface PostProps {
  post: IPost;
  elementRef?: any;
}

const Post: React.FC<PostProps> = ({ post, elementRef }) => {
  const { user } = useAuth();
  const { timeSince } = usePosts();
  const { handleLike, handleUnlike } = usePosts();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`https://localhost:4000/api/post/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Ensure cookies are sent with the request
        });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    }

    if(!post)
      fetchPost();
  }
  , []);

  const navigateToProfile = (event : any) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.href = `/profile/${post.author.userId}`;
  }

  return (
    <>
      {post && (
    
          <div key={post._id} className="postContainer" ref={elementRef}>
          <div className="postAuthor" onClick={navigateToProfile}>
            <img src={`https://localhost:4000/${post.author.profilePic}`} alt={post.author.username} />
            <p>{post.author.username}</p>
            <p> {timeSince(post.createdAt)}</p>
          </div>
          <h2>{post.title}</h2>
          {/* Display the post image if it exists */}
          {post?.photo && <img className="postPhoto" src={`https://localhost:4000/${post.photo}`} alt={post.title} />}
          <p>{post.content}</p>
          
          <div className="postMetaData">
            <p className='likes'>{post.likedBy.length} </p>
              <FontAwesomeIcon 
              icon={user && post.likedBy.includes(user.id)? faHeart : faHeartOutline }
              onClick={user && post.likedBy.includes(user.id)? (e) => handleUnlike(post._id, e) : (e) => handleLike(post._id, e)}
              />

            <p className="comments"> {post.comments.length}</p>
            <FontAwesomeIcon icon={faComment} />
          
          </div>

        </div>
   
        
      )}
    </>
  );
};

export default Post;
