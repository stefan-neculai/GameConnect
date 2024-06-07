import React, { useEffect, useState } from 'react';
import './AddCommunityModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faX } from '@fortawesome/free-solid-svg-icons';
import { Game } from '../types/Game';
import GameUtils from '../utils/GameUtils';

interface AddCommunityModalProps {
  onCommunitySubmit: (community: { name: string; description: string; relatedGame: string; communityIcon: File | undefined }) => void;
  onClose: () => void;
}

const AddCommunityModal: React.FC<AddCommunityModalProps> = ({ onCommunitySubmit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [relatedGame, setRelatedGame] = useState<Game>();
  const [communityIcon, setCommunityIcon] = useState<File | undefined>();
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const { getImageUrlSmall, getReleaseYear } = GameUtils();
  
  // everytime relatedGame changes
    useEffect(() => {
        if(relatedGame)
            console.log(relatedGame);
    }
    , [relatedGame]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if(relatedGame)
        onCommunitySubmit({ name, description, relatedGame: relatedGame._id, communityIcon });
  };

  const handleCommunityIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files ? e.target.files[0] : null);
    setCommunityIcon(e.target.files ? e.target.files[0] : undefined);
  };

  const fetchSearchResults = async (search: string) => {
    if(search) {
        const response = await fetch(`https://localhost:4000/api/games?search=${search}&limit=${15}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
        });
        if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSearchResults(data.games);
        }
    } 
    else {
        setSearchResults([]);
    }
  }

    const handleSearch = async (event: React.FormEvent<HTMLLabelElement>) => {
        console.log("lmao")
        event.preventDefault();
        setSearchQuery(event.currentTarget.textContent || '');
        fetchSearchResults(event.currentTarget.textContent || '');
    }
    
    const handleSelection = (game: Game) => {
        setRelatedGame(game);
        setSearchQuery(game.name);
    }

    const handleRemoval = () => {
        setRelatedGame(undefined);
        setSearchResults([]);
    }

  return (
    <div className="addCommunityModal">
      <h2>Add Community</h2>
      <form onSubmit={handleSubmit} className="addCommunityForm">
        <label>
          Name:
        </label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        <label>
          Description:  
        </label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        <label>
          Related Game:
        </label>
        {!relatedGame && 
        <label htmlFor="searchInput" className="searchInputLabel" onInput={handleSearch} contentEditable suppressContentEditableWarning={true}>
        </label>
        }
        {relatedGame && 
        <label htmlFor="searchInput" className="searchInputLabel" onInput={handleSearch} contentEditable suppressContentEditableWarning={true}>
            <div> {relatedGame.name} </div>
            <FontAwesomeIcon icon={faX} onClick={handleRemoval}/>
        </label>}
        {!relatedGame && <div className="searchResults">
            {
            searchResults.map((game: Game) => (
                <div key={game._id} className="searchResult" onClick={() => handleSelection(game)}>
                    <img src={getImageUrlSmall(game)} alt={game.name} />
                    <span>{game.name + ` (${getReleaseYear(game)})`}</span>
                </div>
                ))}
        </div>}
        <label>
          Community Icon:
        </label>
        <label htmlFor="communityIcon" className="communityIconLabel">
          <FontAwesomeIcon icon={faFileArrowUp} /> {communityIcon?.name || 'Upload'}
        </label>
        <input id="communityIcon" type="file" onChange={handleCommunityIconChange} accept="image/*" />
      </form>
      <div className="modalControls">
        <button onClick={onClose}>Close</button>
        <button onClick={handleSubmit} type="submit">Submit</button>
      </div>
    </div>
  );
};

export default AddCommunityModal;
