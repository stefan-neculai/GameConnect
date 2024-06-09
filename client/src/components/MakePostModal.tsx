import React, { useEffect, useState } from 'react';
import './MakePostModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faX } from '@fortawesome/free-solid-svg-icons';
import { Game } from '../types/Game';
import GameUtils from '../utils/GameUtils';

interface MakePostModalProps {
  onPostSubmit: (post: { title: string; content: string; postImage: File | undefined }) => void;
  onClose: () => void;
}

const MakePostModal: React.FC<MakePostModalProps> = ({ onPostSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [relatedGame, setRelatedGame] = useState<Game>();
  const [postImage, setPostImage] = useState<File | undefined>();
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const { getImageUrlSmall, getReleaseYear } = GameUtils();

  useEffect(() => {
    if (relatedGame) console.log(relatedGame);
  }, [relatedGame]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onPostSubmit({ title, content, postImage });
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files ? e.target.files[0] : null);
    setPostImage(e.target.files ? e.target.files[0] : undefined);
  };

  const fetchSearchResults = async (search: string) => {
    if (search) {
      const response = await fetch(`https://localhost:4000/api/games?search=${search}&limit=15`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSearchResults(data.games);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = async (event: React.FormEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setSearchQuery(event.currentTarget.textContent || '');
    fetchSearchResults(event.currentTarget.textContent || '');
  };

  const handleSelection = (game: Game) => {
    setRelatedGame(game);
    setSearchQuery(game.name);
  };

  const handleRemoval = () => {
    setRelatedGame(undefined);
    setSearchResults([]);
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
