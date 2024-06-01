import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User } from '../types/User';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
  id: string;
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (user && user.id != id) {
      //setProfilePicture(user.profilePicture);
      const fetchData = async () => {
        const response = await fetch('http://localhost:4000/api/user/' + id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Ensure cookies are sent with the request
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        }
      };
      fetchData();
    }
    else if(user){
      setEditUser(user);
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(editUser);
    if (editUser) {
      // Here you should update the user data with the new profile picture
      const response = await fetch('http://localhost:4000/api/user/update' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify(editUser)
      });

      if(response.ok) { 
        console.log('User updated successfully');
      }

      setEditing(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {!editing ? (
        <>
          <div style={{ textAlign: 'center' }}>
            <img 
              src={profilePicture as string} 
              alt="Profile" 
              style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
            />
          </div>
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Profile Picture:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {profilePicture && (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={profilePicture as string} 
                alt="Profile" 
                style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
              />
            </div>
          )}
          <label>
            Username:
            <input type="text" name="name" value={editUser?.username} onChange={handleInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={editUser?.email} onChange={handleInputChange} disabled />
          </label>
          <label>
            Bio:
            <textarea name="bio" value={editUser?.bio} onChange={handleInputChange} />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
