import React, { useState, useEffect } from "react";
import { Game } from "../types/Game";
import { Link, useParams } from "react-router-dom";
import "./Game.css";
import AddReviewModal from "../components/AddReviewModal";
import { profile } from "console";
import { useAuth } from "../context/AuthContext";
import { Review } from "../types/Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import GameUtils from "../utils/GameUtils";
import { platform } from "os";
import { usePosts } from "../context/PostsContext";

interface RouteParams {
  id: string;
  [key: string]: string | undefined;
}

const GameDetails: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar_games, setSimilarGames] = useState<Game[]>([]);
  const { user, setUser } = useAuth();
  const { id } = useParams<RouteParams>();
  const defaultPicURL = "https://localhost:4000/images/default.jpg";
  const { getRealeaseDay, getReleaseMonth, getReleaseYear } = GameUtils();
  const { timeSince } = usePosts();
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    async function fetchGame() {
      const response = await fetch(`${API_URL}/game/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setGame(data);
      }
    }

    async function fetchSimilarGames() {
      const response = await fetch(
        `${API_URL}/games/similar/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSimilarGames(data);
      }
    }

    async function fetchReviews() {
      const response = await fetch(
        `${API_URL}/reviews/game/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    }

    console.log("game id effect", id, user);
    fetchGame();
    fetchSimilarGames();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (review: {
    rating: number;
    content: string;
  }) => {
    console.log("Review Submitted:", user);
    const reviewData = {
      game: game?._id,
      author: {
        userId: user?._id,
        username: user?.username,
        profilePic: user?.profilePicture,
      },
      rating: review.rating,
      content: review.content,
    };

    const response = fetch(`${API_URL}/review/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent with the request
      body: JSON.stringify(reviewData),
    });

    if ((await response).ok) {
      window.location.reload();
    }
  };

  async function addGameToFavorites() {
    if (user) {
      const response = await fetch(
        `${API_URL}/user/favorite/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request
          body: JSON.stringify({ gameId: id }),
        }
      );
      if (response.ok && id) {
        console.log("Game added to favorites");
        setUser({ ...user, favoriteGames: [...user?.favoriteGames, id] });
      }
    }
  }

  async function removeGameFromFavorites() {
    if (user) {
      const response = await fetch(
        `${API_URL}/user/unfavorite/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request
          body: JSON.stringify({ gameId: id }),
        }
      );
      if (response.ok) {
        console.log("Game removed from favorites");
        setUser({
          ...user,
          favoriteGames: user?.favoriteGames.filter((game: any) => game !== id),
        });
      }
    }
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gamePage">
      <div className="gameGeneralInfo">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${
            game.cover.url.split("/")[7]
          }`}
          alt="Game Cover"
        />
        <div className="gameGeneralInfoFlexbox">
          <h1>{game.name}</h1>
          <p>
            <strong>Developers:</strong>{" "}
            {game.involved_companies.map((ic) => ic.company.name).join(", ")}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {game.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p>
            <strong>Game Modes:</strong>{" "}
            {game.game_modes.map((mode) => mode.name).join(", ")}
          </p>
          <p>
            <strong>Release Date:</strong>{" "}
            {getRealeaseDay(game) +
              " " +
              getReleaseMonth(game) +
              " " +
              getReleaseYear(game)}
          </p>
          <p>
            <strong>Platforms</strong>{" "}
            {game.platforms.map((platform) => platform.name).join(", ")}
          </p>
        </div>
        <div className="gameOptions">
          <h1>
            {" "}
            <strong>{game.averageRating}</strong>/10{" "}
            <FontAwesomeIcon icon={faStar} />
          </h1>

          {reviews.filter((r) => r.author.userId === user?._id).length === 0 && (
            <button onClick={() => setModalOpen(true)}>Add Review</button>
          )}
          {id && !user?.favoriteGames?.includes(id) ? (
            <button onClick={addGameToFavorites}> Add to Favorites </button>
          ) : (
            <button onClick={removeGameFromFavorites}>
              {" "}
              Remove from Favorites{" "}
            </button>
          )}
          <AddReviewModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onReviewSubmit={handleReviewSubmit}
          />
        </div>
      </div>

      <h2> Summary </h2>
      <p id="gameSummary"> {game.summary}</p>
      {game.storyline && (
        <>
          <h2> Storyline </h2>
          <p id="gameStoryline">{game.storyline}</p>
        </>
      )}

      <div className="reviewsSimilarGamesWrapper">
        {reviews.length === 0 && (
          <h2> No reviews yet. Be the first to review this game!</h2>
        )}
        {reviews.length !== 0 && (
          <div className="reviewsWrapper">
            <h2>
              {" "}
              {reviews.length} review{reviews.length == 1 ? "" : "s"} for{" "}
              {game.name}
            </h2>
            <div className="reviewsList">
              {reviews.map((review) => (
                <>
                  <div key={review._id} className="review">
                    <Link to={`/profile/${review.author.userId}`}>
                      <div className="reviewAuthor">
                        <img
                          src={
                            review.author.profilePic
                              ? "https://localhost:4000/" +
                                review.author.profilePic
                              : defaultPicURL
                          }
                          alt="Author"
                        />

                        <p>{review.author.username}</p>
                        <div className="point"></div>
                        <p> {timeSince(review.createdAt)}</p>
                      </div>
                    </Link>
                    <div className="reviewContent">
                      <p>{review.content}</p>
                      <p>
                        {review.rating} <FontAwesomeIcon icon={faStar} />
                      </p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}

        {similar_games && similar_games.length > 0 && (
          <div className="similarGamesWrapper">
            <h2>Similar Games</h2>
            {similar_games.map((sg) => (
              <Link to={`/game/${sg._id}`} key={sg._id}>
                <div key={sg.id} className="similarGame">
                  <img
                    src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${
                      sg.cover.url.split("/")[7]
                    }`}
                    alt={sg.name}
                  />
                  <p>{sg.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetails;
function PostContext(): { timeSince: any } {
  throw new Error("Function not implemented.");
}
