import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Post.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import CommentModal from './CommentModal';
import IPost from '../types/Post';
import { IComment } from '../types/Comment';
import { useAuth } from '../context/AuthContext';

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`https://localhost:4000/api/posts/${id}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Ensure cookies are sent with the request
        });
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      }
    };

    const fetchComments = async () => {
      const response = await fetch(`https://localhost:4000/api/comments/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Ensure cookies are sent with the request
        });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (comment: { content: string }) => {
    const payload = {
        content: comment.content,
        postId: id,
        author: {
            userId: user?.id,
            username: user?.username,
            profilePic: user?.profilePicture || '',
        }
    }
    const response = await fetch('https://localhost:4000/api/comments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="postComponent">
      {post && (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.photo && <img src={`https://localhost:4000/${post.photo}`} alt="Post" />}
          <p>Author: {post.author.username}</p>
          <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
          <button onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faCommentDots} /> Add Comment
          </button>

          <div className="commentsSection">
            <h3>Comments</h3>
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p>{comment.content}</p>
                <p>Author: {comment.author.username}</p>
                <p>Created At: {new Date(comment.createdAt).toLocaleString()}</p>
                <p> {comment.likedBy.length} <FontAwesomeIcon icon={faHeart}/> </p>
              </div>
            ))}
          </div>
        </>
      )}

      {isModalOpen && <CommentModal onCommentSubmit={handleCommentSubmit} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Post;
