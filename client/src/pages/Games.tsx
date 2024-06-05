import React, { useState, useEffect } from 'react';
import { Game } from '../types/Game';
import './Games.css';
import { Link } from 'react-router-dom';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [lastPage, setlastPage] = useState<number>(0);
  const [limit] = useState<number>(10);  // Number of games per page
  const [search, setSearch] = useState<string>('');
  const [mode, setMode] = useState('all');
  const [genre, setGenre] = useState('all');
  const [platform, setPlatform] = useState('all');

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    fetchGames(newPage, limit, search, genre, platform, mode);
  };

  const fetchGames = async (page : number, limit : number, search : string, genre : string, platform : string, mode :string) => {
    const response = await fetch(`http://localhost:4000/api/games?page=${page}&limit=${limit}&search=${search}&genre=${genre}&platform=${platform}&mode=${mode}`, {
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
  useEffect(() => {
    

    fetchGames(1,10,'', 'all', 'all', 'all');
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    fetchGames(1,10,event.target.value, genre, platform, mode);  
  }

  const handleModeChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
    setMode(event.target.value);
    fetchGames(1,10, search, genre, platform, event.target.value); 
  };

  const handleGenreChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
    fetchGames(1,10, search, event.target.value, platform, mode); 
  };

  const handlePlatformChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(event.target.value);
    fetchGames(1,10, search, genre, event.target.value, mode); 
  };


  return (
    <div className="gamesWrapper">
      <h1>Games List</h1> 
      <div className="gamesInputs">
        <input type="text" onChange={handleSearch} className=''/>
        <select 
          value={mode} 
          onChange={handleModeChange}
        >
          <option value="all"> Game Mode </option>
          <option value="Multiplayer">Multiplayer</option>
          <option value="Single player">Singleplayer</option>
          <option value="Co-operative">Co-operative</option>
        </select>
        <select 
          value={genre} 
          onChange={handleGenreChange}
        >
          <option value="all">Genre</option>
          <option value="Shooter">Shooter</option>
          <option value="Adventure">Adventure</option>
          <option value="Platform"> Platformer </option>
          <option value="Arcade"> Arcade </option>
          <option value="Role-playing (RPG)">RPG</option>
          <option value="Strategy">Strategy</option>
          <option value="Real Time Strategy (RTS)"> RTS </option>
          <option value="MOBA" > MOBA </option>

        </select>
        <select 
          value={platform} 
          onChange={handlePlatformChange}
        >
          <option value="all">Platform</option>
          <option value="PC (Microsoft Windows)">PC</option>
          <option value="Linux">Linux</option>
          <option value="Mac">Mac</option>
          <option value="PlayStation 5">PS5</option>
          <option value="PlayStation 4">PS4</option>
          <option value="PlayStation 3">PS3</option>
          <option value="PlayStation 2">PS2</option>
          <option value="PlayStation">PS</option>
          <option value="Xbox Series X|S">Xbox Series X</option>
          <option value="Xbox One">Xbox One</option>
          <option value="Xbox 360">Xbox 360</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo Switch">Switch</option>
        </select>
      </div>


      <div className="gamesGrid">
        {games && games.map(game => (
          <Link to={`/game/${game._id}`} key={game._id}>
            <div className="gamePanel">
              <img src={"//images.igdb.com/igdb/image/upload/t_cover_big/" + game.cover.url.split("/")[7]}></img>
              <p>{game.name + ` (${new Date(game.first_release_date * 1000).getFullYear()})`}</p  >
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
        {currentPage < lastPage - 3 && <button onClick={() => changePage(currentPage + 1)}> {currentPage + 2} </button> } 
        {currentPage < lastPage - 2 && <p> ... </p> }
        {currentPage != lastPage && <button onClick={() => changePage(lastPage)} disabled={currentPage === lastPage}> {lastPage} </button> }
        <button onClick={() => changePage(currentPage + 1)}  disabled={currentPage === lastPage}> Next </button>
    </div>
    
    </div>
  );
};

export default Games;
