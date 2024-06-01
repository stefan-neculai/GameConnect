import React, { useState, useEffect } from 'react';
import { Game } from '../types/Game';
import { useParams } from 'react-router-dom';
import './Game.css';
import AddReviewModal from '../components/AddReviewModal';
import { profile } from 'console';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types/Review';

interface RouteParams {
  id: string;
  [key: string]: string | undefined;
}

const GameDetails: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { id } = useParams<RouteParams>();
  const { user } = useAuth();
  


  useEffect(() => {
    async function fetchGame() {
      const response = await fetch(`http://localhost:4000/api/game/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setGame(data);
      }
    }

    async function fetchReviews() {
      const response = await fetch(`http://localhost:4000/api/reviews/game/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    }

    fetchGame();
    fetchReviews();
  }, []);

  const handleReviewSubmit = (review: { rating: number; content: string }) => {
    console.log('Review Submitted:', user);
    const reviewData = {
      game: game?._id,
      author: {
        userId: user?.id,
        username: user?.username,
        profilePic: user?.profilePicture
      },
      rating: review.rating,
      content: review.content,
      }

    const response = fetch(`http://localhost:4000/api/review/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Ensure cookies are sent with the request
      body: JSON.stringify(reviewData)
    });
    // Implement the API call to submit the review to the server
  };


  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gameDetails">
      <div className="gameGeneralInfo">
        <img src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/')[7]}`} alt="Game Cover" />
        <div className="gameGeneralInfoFlexbox">
          <h1>{game.name}</h1>
          <p><strong>Developers:</strong> {game.involved_companies.map(ic => ic.company.name).join(', ')}</p>
          <p><strong>Genres:</strong> {game.genres.map(genre => genre.name).join(', ')}</p>
          <p><strong>Game Modes:</strong> {game.game_modes.map(mode => mode.name).join(', ')}</p>
          <p><strong>Release Date:</strong> {new Date(game.first_release_date * 1000).toDateString()}</p>
        </div>
        <div>
          <h1> {game.averageRating} </h1>
          <button onClick={() => setModalOpen(true)}>Add Review</button>
          <AddReviewModal 
            isOpen={isModalOpen} 
            onClose={() => setModalOpen(false)}
            onReviewSubmit={handleReviewSubmit}
          />
            </div>
      </div>
      
      <p><strong>Summary:</strong> {game.summary}</p>
      {game.storyline && <p><strong>Storyline:</strong> {game.storyline}</p>}

      <div className="reviewsSimilarGamesWrapper">
        <div className="reviewsWrapper">
          <h2> Reviews for {game.name}</h2>
          <div className="reviewsList">
            {reviews.map(review => (
              <div key={review._id} className="review">
                <div className="reviewAuthor">
                  <img src={review.author.profilePic!=''? review.author.profilePic : "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"} alt="Author" />
                  <p>{review.author.username}</p>
                </div>
                <div className="reviewContent">
                  <p>{review.content}</p>
                  <p>Rating: {review.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      <div className="similarGamesWrapper">
        <h2>Similar Games</h2>
          {game.similar_games.map(sg => (
            <div key={sg.id}>
              <img src={`https://images.igdb.com/igdb/image/upload/t_thumb/${sg.cover.url.split('/')[7]}`} alt={sg.name} />
              <p>{sg.name}</p>
            </div>
          ))}
      </div>
        
      </div>
    </div>
  );
};

export default GameDetails;
