import React, { useEffect, useState } from 'react';
import './MakePostModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faX } from '@fortawesome/free-solid-svg-icons';
import { usePosts } from '../context/PostsContext';
import { useParams } from 'react-router-dom';

interface MakePostModalProps {
  onClose: () => void;
}

const MakePostModal: React.FC<MakePostModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postImage, setPostImage] = useState<File | undefined>();
  const { submitPost } = usePosts();
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if(id) {
      const response = await submitPost({ title, content, postImage, communityId: id});
      if(response.ok) {
        onClose();
      }
    } 
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostImage(e.target.files ? e.target.files[0] : undefined);
  };

  return (
    <div className="makePostModal">
      <h2>Make a Post</h2>
      <form onSubmit={handleSubmit} className="makePostForm">
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

export default MakePostModal;
