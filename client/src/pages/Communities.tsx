import React, { useEffect, useState } from 'react';
import ICommunity from '../types/Community';
import AddCommunityModal from '../components/AddCommunityModal';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import './Communities.css';
import { Link, useParams } from 'react-router-dom';

const Communities: React.FC = () => {
    const [communities, setCommunities] = useState<ICommunity[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const { id } = useParams();
    
    useEffect(() => {
        async function fetchCommunities() {
            const response = await fetch('https://localhost:4000/api/community', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Ensure cookies are sent with the request
            });
            if (response.ok) {
                const data = await response.json();
                setCommunities(data.communities);
            }
        }

        fetchCommunities();
    }, []);

    const onCommunitySubmit = async (community: { name: string; description: string; relatedGame: string; communityIcon: File | undefined }) => {
        const formData = new FormData();
        formData.append('name', community.name);
        formData.append('description', community.description);
        formData.append('relatedGame', community.relatedGame);
        if (user) 
            formData.append('userId', user.id);
        if (community.communityIcon) {
            formData.append('communityIcon', community.communityIcon);
        }

        const response = await fetch('https://localhost:4000/api/community/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: formData
        });
        console.log(response)
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setIsModalOpen(false);
            setCommunities([...communities, data]);
        }
    }

    const joinCommunity = async (communityId: string) => {
        const response = await fetch(`https://localhost:4000/api/community/join/${communityId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }
    }

    const leaveCommunity = async (communityId: string) => {
        const response = await fetch(`https://localhost:4000/api/community/leave/${communityId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }
    }

    return (
        <div>
            <h1>Communities Page</h1>
            {/* Add your content here */}
            <button onClick={() => setIsModalOpen(true)} > Create Community</button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddCommunityModal onCommunitySubmit={onCommunitySubmit} onClose={() => setIsModalOpen(false)} />
            </Modal>
            <h1> Communities List </h1>
            <div className="communitiesList">
                {communities.map((community) => {
                    return (
                        
                        <div key={community._id} className='communityItem'>
                            <img src={community.communityIcon} alt="Community Icon" />
                            <div className='communityInfo'>
                            <Link to={`/community/${community._id}`}>
                                <h2>{community.name}</h2>
                            </Link>
                                <p>{community.description}</p>
                                <p> {community.members.length} Members</p>
                                {user?.id && !community.members.includes(user?.id) &&  
                                <button onClick={() => joinCommunity(community._id)}> Join Community </button>}
                                {user?.id && community.members.includes(user?.id) &&
                                <button className="negativeButton" onClick={() => leaveCommunity(community._id)}> Leave Community </button>}
                            </div>

                        </div>
                 

                    );
                })}
            </div>

        </div>
    );
};

export default Communities;