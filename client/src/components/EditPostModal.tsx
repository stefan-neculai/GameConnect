import React, { useEffect, useState } from 'react';
import './EditPostModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faX } from '@fortawesome/free-solid-svg-icons';
import IPost from '../types/Post';
import { on } from 'events';

interface EditPostModalProps {
  post: IPost;
  onPostSubmit: (postId: string, newPost: { title: string; content: string; postImage: File | undefined }) => void;
  onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onPostSubmit, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [postImage, setPostImage] = useState<File | undefined>();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onPostSubmit(post._id, { title, content, postImage });
    onClose();
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostImage(e.target.files ? e.target.files[0] : undefined);
  };

  return (
    <div className="editPostModal">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className="editPostForm">
        <label>
          Title:
        </label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        <label>
          Content:
        </label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required />
        <label>
          Post Image:
        </label>
        <label htmlFor="postImage" className="postImageLabel">
          <FontAwesomeIcon icon={faFileArrowUp} /> {postImage?.name || 'Upload'}
        </label>
        <input id="postImage" type="file" onChange={handlePostImageChange} accept="image/*" />
      </form>
      <div className="modalControls">
        <button onClick={onClose}>Close</button>
        <button onClick={handleSubmit} type="submit">Submit</button>
      </div>
    </div>
  );
};

export default EditPostModal;
