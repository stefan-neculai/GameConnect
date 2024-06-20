import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import IPost from "../types/Post";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router-dom";

interface PostsContextType {
  posts: IPost[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  addPost: (newPost: IPost) => void;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  handleLike: (postId: string, event: any) => void;
  handleUnlike: (postId: string, event: any) => void;
  lastPostElementRef: (node: HTMLDivElement) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getPosts: (
    page: number,
    limit: number,
    communities: string[],
    order: string
  ) => Promise<any>;
  timeSince: (date: Date) => string;
  submitPost: (post: {
    title: string;
    content: string;
    postImage: File | undefined;
  }) => Promise<any>;
likePost: (postId: string) => Promise<any>;
unlikePost: (postId: string) => Promise<any>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const [total, setTotal] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  // function that converts date to ago format
  const timeSince = (date: Date) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
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
  };

  const likePost = async (postId: string) => {
    // Like post and return smth
    const response = await fetch(
      `https://localhost:4000/api/posts/${postId}/like`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return response;
  };

  const unlikePost = async (postId: string) => {
    console.log("unliking post");
    // Unlike post and return smth
    const response = await fetch(
      `https://localhost:4000/api/posts/${postId}/unlike`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return response;
  };

  const getPosts = async (
    page: number,
    limit: number,
    communities: string[],
    order: string
  ) => {
    const response = await fetch(
      `https://localhost:4000/api/posts?communityIds=${communities.join(",")}&page=${page}&limit=${limit}&order=${order}`,
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
      console.log(data);
      return data;
    }
    return null;
  };

  const submitPost = async (post: {
    title: string;
    content: string;
    postImage: File | undefined;
  }) => {
    // Submit post to API
    const payload = new FormData();
    payload.append("title", post.title);
    payload.append("content", post.content);

    if (id) payload.append("community", id);

    if (user) {
      payload.append("userId", user.id);
      payload.append("username", user.username);
      payload.append("profilePic", user.profilePicture || "");
    }

    if (post.postImage) {
      payload.append("photo", post.postImage);
    }

    const response = await fetch("https://localhost:4000/api/posts/create", {
      method: "POST",
      credentials: "include", // Ensure cookies are sent with the request
      body: payload,
    });

    return response;
  };

  const addPost = (newPost: IPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
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

  const handleLike = async (postId: string, event: any) => {
    event.stopPropagation();
    event.preventDefault();
    // use the likePost function from PostUtils
    const response = await likePost(postId);
    console.log(response);
    if (response.ok) {
      // Update the posts state
      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            post.likedBy.push(user?.id || "");
          }
          return post;
        })
      );
    }
  };

  const handleUnlike = async (postId: string, event: any) => {
    event.stopPropagation();
    event.preventDefault();
    // use the unlikePost function from PostUtils
    const response = await unlikePost(postId);
    console.log(response);
    if (response.ok) {
      // Update the posts state
      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            post.likedBy = post.likedBy.filter((id) => id !== user?.id);
          }
          return post;
        })
      );
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        page,
        limit,
        total,
        loading,
        addPost,
        setPosts,
        handleLike,
        handleUnlike,
        lastPostElementRef,
        setPage,
        setLimit,
        setTotal,
        setLoading,
        getPosts,
        timeSince,
        submitPost,
        likePost,
        unlikePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
