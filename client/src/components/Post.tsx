import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart as faHeartOutline,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsisH, faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import IPost from "../types/Post";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import ICommunity from "../types/Community";
import ImageModal from "./ImageModal";
import Modal from "./Modal";
import EditPostModal from "./EditPostModal";

interface PostProps {
  post: IPost;
  elementRef?: any;
  community?: ICommunity;
}

const Post: React.FC<PostProps> = ({ post, elementRef, community }) => {
  const { user } = useAuth();
  const { timeSince } = usePosts();
  const { handleLike, handleUnlike, deletePost, editPost } = usePosts();
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${API_URL}/post/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    };

    if (!post) fetchPost();
  }, []);

  const navigateToProfile = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.href = `/profile/${post.author.userId}`;
  };

  const navigateToPost = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.href = `/post/${post._id}`;
  }

  const handleModal = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  }

  const handleMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  }

  const handleDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    deletePost(post._id);
  }

  const handleEdit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  }

  return (
    <>
      {post && (
        <div key={post._id} className="postContainer" ref={elementRef} onClick={navigateToPost}>
          <ImageModal
            imageUrl={`https://localhost:4000/${post.photo}`}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            <EditPostModal post={post} onClose={() => setIsEditModalOpen(false)} onPostSubmit={editPost}/>
          </Modal>
          
          <div className="postAuthor" onClick={navigateToProfile}>
            <img
              src={`https://localhost:4000/${post.author.profilePic}`}
              alt={post.author.username}
            />
            <p>{post.author.username}</p>
            <div className="point"></div>
            <p> {timeSince(post.createdAt)}</p>
            {!window.location.href.includes('community') && community && (<>
              <div className="point"></div>
              from
              <strong className="communityLink"><Link to={`/community/${community._id}`} onClick={(e) => e.stopPropagation()}> {community.name} </Link></strong>
            </>
              
            )}
            {post.author.userId === user?._id && <FontAwesomeIcon icon={faEllipsisH} onClick={handleMenu}/>}
            {isMenuOpen && 
            <div className="optionsMenu">
              <div onClick={handleEdit}> <FontAwesomeIcon icon={faPenToSquare}/> Edit </div>
              <div onClick={handleDelete}> <FontAwesomeIcon icon={faTrash}/> Delete </div>  
            </div>}
          </div>
          <h2>{post.title}</h2>
          {/* Display the post image if it exists */}
          {post?.photo && (
            <div className="postPhotoWrapper">
              <img
                className="postPhoto"
                src={`https://localhost:4000/${post.photo}`}
                alt={post.title}
                onClick={handleModal}
              />
            </div>
          )}
          <div className="postContent">
            {post.content.split("\n").map((line: string, index: number) => 
              <p key={index}>{line}</p> 
            )}
          </div>
          <div className="postMetaData">
            <p className="likes">{post.likedBy.length} </p>
            <FontAwesomeIcon
              icon={
                user && post.likedBy.includes(user._id)
                  ? faHeart
                  : faHeartOutline
              }
              onClick={
                user && post.likedBy.includes(user._id)
                  ? (e) => handleUnlike(post._id, e)
                  : (e) => handleLike(post._id, e)
              }
            />

            <p className="comments"> {post.comments.length}</p>
            <FontAwesomeIcon icon={faComment} />
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
