import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { usePosts } from "../context/PostsContext";

// Define the Posts component interface for the props
// it includes communityids
interface PostsProps {
  communityIds: string[];
}

const Posts: React.FC<PostsProps> = ({ communityIds }) => {
  const [order, setOrder] = useState('new'); 
  const {
    posts,
    page,
    limit,
    total,
    loading,
    setPage,
    setLimit,
    setLoading,
    setTotal,
    setPosts,
    handleLike,
    handleUnlike,
    lastPostElementRef,
    getPosts
  } = usePosts();

  useEffect(() => {
    // Fetch posts from API
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
  
    fetchPosts();
  }, [page]);

  useEffect(() => {
    setPosts([]);
    setTotal(0);
    setPage(1);
  }, [order]);

  if (!posts) {
    return <div>Loading...</div>;
  }
  return (
    <>
        <select onChange={(e) => setOrder(e.target.value)}>
            <option value="new">New</option>
            <option value="top">Top</option>
            <option value="old">Old</option>
        </select>
        <div>
        {posts.map((post, index) => (
            <Post
            key={post._id}
            post={post}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            elementRef={index === posts.length - 1 ? lastPostElementRef : null}
            />
        ))}
        {loading && <p>Loading...</p>}
        </div>
    </>

  );
};

export default Posts;
