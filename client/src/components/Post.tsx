import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Post.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import IPost from '../types/Post';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';


interface PostProps {
  post: IPost;
  handleLike: (postId: string, e: any) => void;
  handleUnlike: (postId: string, e: any) => void;
  elementRef: any;
}

const Post: React.FC<PostProps> = ({ post, handleLike, handleUnlike, elementRef }) => {
  const { user } = useAuth();
  const { timeSince } = usePosts();

  return (
    <>
      {post && (
        <div key={post._id} className="postContainer" ref={elementRef}>
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
      )}
    </>
  );
};

export default Post;
