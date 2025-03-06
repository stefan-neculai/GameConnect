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
    const API_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        async function fetchCommunities() {
            const response = await fetch(`${API_URL}/community`, {
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
            formData.append('userId', user._id);
        if (community.communityIcon) {
            formData.append('communityIcon', community.communityIcon);
        }

        const response = await fetch(`${API_URL}/community/create`, {
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
        const response = await fetch(`${API_URL}/community/join/${communityId}`, {
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
        const response = await fetch(`${API_URL}/community/leave/${communityId}`, {
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
            <h1 className="pageHeader">Communities ({communities.length})  <button onClick={() => setIsModalOpen(true)} > Create Community</button></h1>
            {/* Add your content here */}
           
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddCommunityModal onCommunitySubmit={onCommunitySubmit} onClose={() => setIsModalOpen(false)} />
            </Modal>
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
                                {user?._id && !community.members.includes(user?._id) &&  
                                <button onClick={() => joinCommunity(community._id)}> Join Community </button>}
                                {user?._id && community.members.includes(user?._id) &&
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