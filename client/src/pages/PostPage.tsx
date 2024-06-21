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
import { faHeart } from "@fortawesome/free-solid-svg-icons";
// import Comments from './Comments';
interface PostPageProps {
  post?: IPost;
}
const PostPage: React.FC<PostPageProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]); // [Comment, Comment, Comment
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { posts, addPost, addComment } = usePosts();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`https://localhost:4000/api/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        addPost(data);
      }
    };

    const fetchComments = async () => {
      console.log("fetching comments", id);
      const response = await fetch(
        `https://localhost:4000/api/comments/${id}`,
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
    fetchComments();
  }, []);

  const onCommentSubmit = async (comment: { content: string }) => {
    // Add comment to post
    const payload = {
      ...comment,
      post: id,
      author: {
        userId: user?.id,
        username: user?.username,
        profilePic: user?.profilePicture,
      },
    };
    const response = await fetch(`https://localhost:4000/api/comments/create`, {
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
    const response = await fetch(`https://localhost:4000/api/comments/${_id}/unlike`, {
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
            likedBy: comment.likedBy.filter((userId) => userId !== user?.id)
          }
        }
        return comment;
      });
      setComments(updatedComments);
    }
  }

  const handleLike = async (_id: any, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const response = await fetch(`https://localhost:4000/api/comments/${_id}/like`, {
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
            likedBy: [...comment.likedBy, user?.id]
          }
        }
        return comment;
      });
      setComments(updatedComments);
    }
  }

  return (
    <div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CommentModal
            onCommentSubmit={onCommentSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
      <button onClick={() => setIsModalOpen(true)}> Add Comment </button>
      {posts ? (
        <div>
          <Post post={posts.filter((post) => post._id === id)[0]} />
          <h2>Comments</h2>
          {comments.map((comment: any) => (
            <div key={comment._id} className="commentContainer">
              <div className="commentAuthor">
                <img
                  src={`https://localhost:4000/${comment.author.profilePic}`}
                  alt={comment.author.username}
                />
                <h3>{comment.author.username}</h3>
              </div>
              <p>{comment.content}</p>

              <p className="commentLikes">
                <div> {comment.likedBy.length}{" "} </div>
                <FontAwesomeIcon
                  icon={
                    user && comment.likedBy.includes(user.id)
                      ? faHeart
                      : faHeartOutline
                  }
                  onClick={
                    user && comment.likedBy.includes(user.id)
                      ? (e) => handleUnlike(comment._id, e)
                      : (e) => handleLike(comment._id, e)
                  }
                />{" "}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PostPage;
