import React, { useEffect, useState, useRef, useCallback } from "react";
import Post from "../components/Post";
import ICommunity from "../types/Community";
import IPost from "../types/Post";

// Define the Posts component interface for the props
// it includes communityids
interface PostsProps {
  communityIds: string[];
}

const Posts: React.FC<PostsProps> = ({ communityIds }) => {
  // const {
  //   posts,
  //   page,
  //   limit,
  //   total,
  //   loading,
  //   order,
  //   setPage,
  //   setLoading,
  //   setTotal,
  //   setPosts,
  //   lastPostElementRef,
  //   getPosts,
  //   setOrder
  // } = usePosts();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState("new");
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const getPosts = async (
    page: number,
    limit: number,
    communities: string[],
    order: string
  ) => {
    const response = await fetch(
      `${API_URL}/posts?communityIds=${communities?.join(
        ","
      )}&page=${page}&limit=${limit}&order=${order}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  };

  const fetchPosts = async () => {
    console.log("Fetching posts", posts);
    setLoading(true);
    const postsData = await getPosts(page, limit, communityIds, order);
    if (total === 0) setTotal(postsData.total);
    console.log(postsData);
    if (postsData) {
      setPosts([...posts, ...postsData.posts]);
    }
    setLoading(false);
  };

    const lastPostElementRef = useCallback(
      (node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            if (posts.length + limit <= total)
              setPage((prevPage) => prevPage + 1);
          }
        });
        if (node) observer.current.observe(node);
      },
      [loading]
    );

  // fetch posts if not already in posts
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }
  , [page]);

  useEffect(() => {
    setPosts([]);
    setTotal(0);
    setPage(1);
  }, [order]);

  // useEffect(() => {
  //   setPosts([]);
  //   setTotal(0);
  //   setPage(1);
  // }, []);

  // useEffect(() => {
  //   // Fetch posts from API
  //   const fetchPosts = async () => {
  //     setLoading(true);
  //     const postsData = await getPosts(page, limit, communityIds, order);
  //     if (total === 0) setTotal(postsData.total);
  //     if (postsData) {
  //       console.log(posts);
  //       setPosts([...posts, ...postsData.posts]);
  //     }
  //     setLoading(false);
  //   };
    
  //   const fetchCommunities = async () => {
  //     const response = await fetch(`${API_URL}/community?communityIds=${communityIds}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       credentials: 'include', // Ensure cookies are sent with the request
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data)
  //       setCommunities(data.communities);
  //     }
  //   }

  //   fetchCommunities();
  //   fetchPosts();
  // }, [page]);
  
  // useEffect(() => {
  //   setPosts([]);
  //   setTotal(0);
  //   setPage(1);
  // }, [order]);

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
            elementRef={posts.length === index + 1 ? lastPostElementRef : undefined}
            community={communities.find((c) => c._id === post.community)}
            />
        ))}
        {loading && <p>Loading...</p>}
    </div>

  );
};

export default Posts;
