import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import IPost from "../types/Post";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import CommentModal from "../components/CommentModal";
import Modal from "../components/Modal";
import { IComment } from "../types/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart, faShare, faComment } from "@fortawesome/free-solid-svg-icons";
import BreadcrumbNavigator from "../components/BreadcrumbNavigator";
import ICommunity from "../types/Community";
import Comment from "../components/Comment";

// import Comments from './Comments';
interface PostPageProps {
  post?: IPost;
  community?: ICommunity;
}
const PostPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]); // [Comment, Comment, Comment
  const [community, setCommunity] = useState<ICommunity>();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { posts, addPost, addComment } = usePosts();
  const [post, setPost] = useState<IPost>();
  const author = post?.author;
  const testComments : any = [
    {
      _id: "1",
      author: author,
      createdAt: new Date(),
      likedBy: [],
      content: "This is a comment",
      comments: [
        {
          _id: "2",
          content: "This is a reply",
          author: author,
          createdAt: new Date(),
          likedBy: [],
          comments: [
            {
              _id: "3",
              content: "This is a reply to a reply",
              author: author,
              createdAt: new Date(),
              likedBy: [],
              comments: [],
            },
          ],
        },
      ],
    },
  ]
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        fetchCommunity(data.community);
        addPost(data);
        setPost(data);
      }
    };

    const fetchCommunity = async (communityId : string) => {
      const response = await fetch(`${API_URL}/community/${communityId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setCommunity(data);
      }
    }

    const fetchComments = async () => {
      console.log("fetching comments", id);
      const response = await fetch(
        `${API_URL}/comments/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setComments(data);
      }
    };

    if (posts.length === 0) fetchPost();
    else {
      fetchCommunity(posts.filter((post) => post._id === id)[0].community);
    }
    fetchComments();
  }, []);

  const onCommentSubmit = async (comment: { content: string }) => {
    // Add comment to post
    const payload = {
      ...comment,
      post: id,
      author: {
        userId: user?._id,
        username: user?.username,
        profilePic: user?.profilePicture,
      },
    };
    const response = await fetch(`${API_URL}/comments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setComments([...comments, data]);
      if (id) addComment(id, data._id);
      setIsModalOpen(false);
    }
  };

  const handleUnlike = async (_id: any, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const response = await fetch(`${API_URL}/comments/${_id}/unlike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }); 
    if(response.ok) {
      const updatedComments = comments.map((comment) => {
        if(comment._id === _id) {
          return {
            ...comment,
            likedBy: comment.likedBy.filter((userId) => userId !== user?._id)
          }
        }
        return comment;
      });
      setComments(updatedComments);
    }
  }

  const handleLike = async (_id: any, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const response = await fetch(`${API_URL}/comments/${_id}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }); 
    if(response.ok && user) {
      const updatedComments = comments.map((comment) => {
        if(comment._id === _id) {
          return {
            ...comment,
            likedBy: [...comment.likedBy, user?._id]
          }
        }
        return comment;
      });
      setComments(updatedComments);
    }
  }

  if(!community) 
    return null;
  return (
    <div className="postPage">
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CommentModal
            onCommentSubmit={onCommentSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
      <BreadcrumbNavigator breadcrumbs={[{ text: "Home", path: "/" }, { text: `${community?.name}` , path: `/community/${community?._id}`}, { text: `${post?.title}` }]} />
   
      {posts ? (
        <div className="postPageContent">
          <Post post={posts.filter((post) => post._id === id)[0]} />
            <div className="commentsHeader"> 
            {comments.length !== 0 && <h2>Comments ({comments.length})</h2> }
            {comments.length === 0 && <h2>No comments yet</h2>}
            <button onClick={() => setIsModalOpen(true)}> Add Comment </button>
            </div>

          <div className="commentsContainer">
            {comments.map((comment: any) => (
              <Comment
                comment={comment}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                comments={[]}
                indent={0}
              />
            ))}
            <Comment
              comment={testComments[0]}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              comments={testComments[0].comments}
              indent={0}
            />
            </div>
   
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PostPage;
