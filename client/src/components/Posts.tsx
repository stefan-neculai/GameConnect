import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { usePosts } from "../context/PostsContext";
import { Link } from "react-router-dom";

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
              <Link to={`/post/${post._id}`}>
            <Post
            key={post._id}
            post={post}
            elementRef={index === posts.length - 1 ? lastPostElementRef : null}
            />
              </Link>


        ))}
        {loading && <p>Loading...</p>}
    </div>

  );
};

export default Posts;
