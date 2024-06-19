import { time } from 'console';
import React, { useState } from 'react';


const PostUtils : any = () => {

    // function that conerts date to ago format
    const timeSince = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " years ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";

      }

    const likePost = async (postId: string) => {
       
        // Like post and return smth
        const response = await fetch(`https://localhost:4000/api/posts/${postId}/like`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    }

    const unlikePost = async (postId: string) => {
        
        console.log('unliking post')
        // Unlike post and return smth
        const response = await fetch(`https://localhost:4000/api/posts/${postId}/unlike`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    }

    const getPosts = async (page : number, limit : number, communityIds: string[]) => {
        const response = await fetch(`https://localhost:4000/api/posts?communityIds=${communityIds.join(',')}&page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            return data;
        }
        return null;
    }

    return {
        timeSince,
        likePost,
        unlikePost,
        getPosts
    }
};

export default PostUtils;
