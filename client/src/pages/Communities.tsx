import React, { useEffect, useState } from 'react';
import ICommunity from '../types/Community';
import AddCommunityModal from '../components/AddCommunityModal';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Communities: React.FC = () => {
    const [communities, setCommunities] = useState<ICommunity[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

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


    return (
        <div>
            <h1>Communities Page</h1>
            {/* Add your content here */}
            <button onClick={() => setIsModalOpen(true)} > Create Community</button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddCommunityModal onCommunitySubmit={onCommunitySubmit} onClose={() => setIsModalOpen(false)} />
            </Modal>
            <h1> Communities List </h1>
            <div className="communitiesGrid">
                {communities.map((community) => {
                    return (
                        <div key={community._id}>
                            <img src={`https://localhost:4000/api/community/${community._id}/icon`} alt="Community Icon" />
                            <h2>{community.name}</h2>
                            <p>{community.description}</p>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Communities;