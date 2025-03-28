import React from 'react';
import { User } from '../types/User';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Followers.css';

interface FollowersProps {
    followUser: (id : string | undefined) => void;
    unfollowUser: (id : string | undefined) => void;
    onClose: () => void;
}

const Followers: React.FC<FollowersProps> = ({ followUser, unfollowUser, onClose}) => {
    // Assuming you have an array of followers
    const [followers, setFollowers] = React.useState<User[]>([]);
    const { id } = useParams();
    const { user } = useAuth();
    const API_URL = process.env.REACT_APP_API_URL;
    React.useEffect(() => {
        const fetchFollowers = async () => {
            const response = await fetch(`${API_URL}/user/followers/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Ensure cookies are sent with the request
            });
            if (response.ok) {
                const data = await response.json();
                setFollowers(data);
            }
        };

        fetchFollowers();
    }, []);

    return (
        <div className="followersModal">
            <h1>Followers ({followers.length})</h1>
            <ul className="followersList">
               
                {followers.map((follower, index) => (
                    <li key={index}>
                        <Link to={`/profile/${follower._id}`} onClick={onClose}>
                            <img className="profilePicture" src={follower.profilePicture? `${API_URL}` + follower.profilePicture : `${API_URL}/../images/default.jpg`} alt="Profile"/>
                            <p></p>{follower.username}
                        </Link>
                        {user && follower.followers.includes(user._id)?
                        <button onClick={() => unfollowUser(follower._id)}> Unfollow </button>
                        : follower._id != user?._id && <button onClick={() => followUser(follower._id)}> Follow </button>}

                    </li>
                ))}
            </ul>
            <div className="modalControls">
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Followers;