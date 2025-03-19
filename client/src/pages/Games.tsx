import React, { useState, useEffect } from 'react';
import { Game } from '../types/Game';
import './Games.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSearch, faArrowDown, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { genreOptions, modeOptions, platformOptions } from '../constants/filterOptions';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [lastPage, setlastPage] = useState<number>(0);
  const [limit] = useState<number>(10);  // Number of games per page
  const [search, setSearch] = useState<string>('');
  const [mode, setMode] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState<{genre : boolean, platform : boolean, mode : boolean}>({
    genre: false,
    platform: false,
    mode: false,
  });
  const [selectedFilter, setSelectedFilter] = useState<{ genre : string[], platform : string[], mode : string[]}>({
    genre: [],
    platform: [],
    mode: [],
  });

  const API_URL = process.env.REACT_APP_API_URL;
  
  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    fetchGames(newPage, limit);
  };

  const fetchGames = async (page : number, limit : number) => {
    const response = await fetch(`${API_URL}/games?page=${page}&limit=${limit}&search=${search}&genres=${selectedFilter.genre}&platforms=${selectedFilter.platform}&modes=${selectedFilter.mode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Ensure cookies are sent with the request
    });
    if(response.ok) { 
      const data = await response.json();
      setTotalGames(data.total);
      setlastPage(Math.round(data.total / limit));
      setGames(data.games);
    }
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      }
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  const handleDebouncedSearch = debounce(fetchGames, 500);

  useEffect(() => {
    fetchGames(1,10);
  }, []);

  useEffect(() => {
    handleDebouncedSearch(currentPage, limit);
  }
  ,[selectedFilter, search]);


  const handleFilterOpen = (filter: keyof typeof isFilterOpen) => {
    setIsFilterOpen({...isFilterOpen, [filter]: !isFilterOpen[filter]});
  };

  const handleSetFilter = (filter: keyof typeof isFilterOpen, value: string) => {
    if(selectedFilter[filter].includes(value)) {
      setSelectedFilter({
        ...selectedFilter,
        [filter]: selectedFilter[filter].filter((el) => el !== value)
      });
    } else {
      setSelectedFilter({
        ...selectedFilter,
        [filter]: [...selectedFilter[filter], value]
      })
    }
  }

  const isChecked = (filter: keyof typeof isFilterOpen, option: string) => {
    return selectedFilter[filter].includes(option);
  }

  return (
    <div className="gamesWrapper">
      <h1>Games List</h1> 
      <div className="gamesSearch">
        <div className="gamesSearchBar">
          <FontAwesomeIcon icon={faSearch} /> 
          <input className="gamesSearchInput" onChange={(e) => setSearch(e.target.value)} placeholder='Search games...'/>
        </div>
        <div>
          Filter options:
        </div>
        <div onClick={() => handleFilterOpen("genre")} className="genreFilter">
          Genre
        </div>
        <div onClick={() => handleFilterOpen("platform")} className="platformFilter">
          Platform
        </div>
        <div onClick={() => handleFilterOpen("mode")} className="modeFilter">
          Mode
        </div>
      </div>
      {isFilterOpen.genre && <div className="filterOptions">
        {genreOptions.map(option => (
          <div className="filterOption" key={option}>
            <input type="checkbox" value={option} onChange={() => handleSetFilter("genre", option)} checked={isChecked("genre", option)}/>
            <label> {option} </label>
          </div>
        ))}
        </div>
      }
      {isFilterOpen.platform && <div className="filterOptions">
        {platformOptions.map(option => (
          <div className="filterOption" key={option}>
            <input type="checkbox" value={option} onChange={() => handleSetFilter("platform", option)} checked={isChecked("platform", option)}/>
            <label> {option} </label>
          </div>
        ))}
        </div>
      }
      {isFilterOpen.mode && <div className="filterOptions">
        {modeOptions.map(option => (
          <div className="filterOption" key={option}>
            <input type="checkbox" value={option} onChange={() => handleSetFilter("mode", option)} checked={isChecked("mode", option)}/>
            <label> {option} </label>
          </div>
        ))}
        </div>
      }
      <div className="filterPills">
        {selectedFilter.genre.map(filter => (
          <div className="filterPill" key={filter}>
            {filter}
          </div>
        ))}
        {selectedFilter.platform.map(filter => (
          <div className="filterPill" key={filter}>
            {filter}
          </div>
        ))}
        {selectedFilter.mode.map(filter => (
          <div className="filterPill" key={filter}>
            {filter}
          </div>
        ))}
      </div>

      <div className="gamesGrid">
        {games && games.map(game => (
          <Link to={`/game/${game._id}`} key={game._id}>
            <div className="gamePanel">
              <img src={"//images.igdb.com/igdb/image/upload/t_cover_big/" + game.cover.url.split("/")[7]}></img>
              <p className="gameTitle">{game.name}</p>
              <p>{new Date(game.first_release_date * 1000).getFullYear()} </p>
              <p> {game.averageRating} <FontAwesomeIcon icon={faStar}/></p>
            </div>
          </Link>

        ))}
      </div>

      <div className="pagination">
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}> Previous </button>
        {currentPage != 1 && <button onClick={() => changePage(1)} disabled={currentPage === 1}> 1 </button> }
        {currentPage > 4 && <p> ... </p> }
        {currentPage > 3 && <button onClick={() => changePage(currentPage - 2)}> {currentPage - 2} </button> }  
        {currentPage > 2 && <button onClick={() => changePage(currentPage - 1)}> {currentPage - 1} </button> }
        <button onClick={() => changePage(currentPage)} disabled={currentPage === currentPage}> {currentPage} </button> 
        {currentPage < lastPage - 1  && <button onClick={() => changePage(currentPage + 1)}> {currentPage + 1} </button> }
        {currentPage < lastPage - 3 && <button onClick={() => changePage(currentPage + 2)}> {currentPage + 2} </button> } 
        {currentPage < lastPage - 2 && <p> ... </p> }
        {currentPage != lastPage && <button onClick={() => changePage(lastPage)} disabled={currentPage === lastPage}> {lastPage} </button> }
        <button onClick={() => changePage(currentPage + 1)}  disabled={currentPage === lastPage}> Next </button>
    </div>
    
    </div>
  );
};

export default Games;
