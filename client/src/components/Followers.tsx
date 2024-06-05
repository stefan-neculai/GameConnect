import React from 'react';
import { User } from '../types/User';
import { useParams } from 'react-router-dom';

const Followers: React.FC = () => {
    // Assuming you have an array of followers
    const [followers, setFollowers] = React.useState<User[]>([]);
    const { id } = useParams();
    
    React.useEffect(() => {
        const fetchFollowers = async () => {
            const response = await fetch(`http://localhost:4000/api/user/followers/${id}`, {
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
        <div>
            <h1>List of Followers</h1>
            <ul>
                {followers.map((follower, index) => (
                    <li key={index}>{follower.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default Followers;