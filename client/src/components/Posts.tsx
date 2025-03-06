import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { usePosts } from "../context/PostsContext";
import { Link, Navigate } from "react-router-dom";
import ICommunity from "../types/Community";
import { faWindows } from "@fortawesome/free-brands-svg-icons";

// Define the Posts component interface for the props
// it includes communityids
interface PostsProps {
  communityIds: string[];
}

const Posts: React.FC<PostsProps> = ({ communityIds }) => {
  const {
    posts,
    page,
    limit,
    total,
    loading,
    order,
    setPage,
    setLoading,
    setTotal,
    setPosts,
    handleLike,
    handleUnlike,
    lastPostElementRef,
    getPosts,
    setOrder
  } = usePosts();
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    console.log("first render")
    setPosts([]);
    setTotal(0);
    setPage(1);
  }, []);

  useEffect(() => {
    // Fetch posts from API
    console.log("page changed")
    const fetchPosts = async () => {
      setLoading(true);
      const postsData = await getPosts(page, limit, communityIds, order);
      if (total === 0) setTotal(postsData.total);
      if (postsData) {
        console.log(posts);
        setPosts([...posts, ...postsData.posts]);
      }
      setLoading(false);
    };
    
    const fetchCommunities = async () => {
      const response = await fetch(`${API_URL}/community?communityIds=${communityIds}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setCommunities(data.communities);
      }
    }

    fetchCommunities();
    fetchPosts();
  }, [page]);
  
  useEffect(() => {
    console.log("wtf")
    setPosts([]);
    setTotal(0);
    setPage(1);
  }, [order]);

  if (!posts) {
    return <div>Loading...</div>;
  }
  return (
    <div className="postsWrapper">
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="new">New</option>
            <option value="top">Top</option>
            <option value="old">Old</option>
        </select>
        {posts.map((post, index) => (
            <Post
            key={post._id}
            post={post}
            elementRef={index === posts.length - 1 ? lastPostElementRef : null}
            community={communities.find((c) => c._id === post.community)}
            />
        ))}
        {loading && <p>Loading...</p>}
    </div>

  );
};

export default Posts;
