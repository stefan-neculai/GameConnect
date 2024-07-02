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
    
    React.useEffect(() => {
        const fetchFollowers = async () => {
            const response = await fetch(`https://localhost:4000/api/user/followers/${id}`, {
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
            <h1>List of Followers</h1>
            <ul className="followersList">
               
                {followers.map((follower, index) => (
                    <li key={index}>
                        <Link to={`/profile/${follower._id}`} onClick={onClose}>
                            <img className="profilePicture" src={follower.profilePicture? "https://localhost:4000/" + follower.profilePicture : "https://localhost:4000/images/default.jpg"} alt="Profile Picture"/>
                            <p></p>{follower.username}
                        </Link>
                        {user && follower.followers.includes(user.id)?
                        <button onClick={() => unfollowUser(follower._id)}> Unfollow </button>
                        : follower._id != user?.id && <button onClick={() => followUser(follower._id)}> Follow </button>}

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