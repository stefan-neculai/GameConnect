import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import { IComment } from '../types/Comment';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import "./Comment.css";

interface CommentProps {
    comment: IComment;
    handleLike: (_id: any, e: any) => void;
    handleUnlike: (_id: any, e: any) => void;
    comments: IComment[];
    indent: number;
}

const Comment: React.FC<CommentProps> = ({comment, handleLike, handleUnlike, comments, indent }) => {
    const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState<IComment[]>([]);
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { addComment } = usePosts();
    const { timeSince } = usePosts();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Component did mount logic here

        return () => {
            // Component will unmount logic here
        };
    }, []);

    const handleReply = async () => {
        const payload = {
            post: null,
            commentParent: comment._id,
            content: replyText,
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
    
            setReplies([...replies, data]);
            }
        };



    return (
            <>
                <div key={comment._id} className="commentContainer">
                    <div className="commentAuthor">
                    <img
                        src={`https://localhost:4000/${comment.author.profilePic}`}
                        alt={comment.author.username}
                    />
                    <h3>{comment.author.username}</h3>
                    <div className="point"></div>
                    <p> {timeSince(comment.createdAt)}</p>
                    </div>

                    {comment.content.split("\n").map((line: string, index: number) => (
                    <p key={index}>{line}</p>
                    ))}

                    <div className="commentActions">
                    <div className="commentLikes">
                        <div> {comment.likedBy.length}{" "} </div>
                        <span> Like{comment.likedBy.length > 1? 's' : ''} </span>
                        <div className="heartIconWrapper">
                        <FontAwesomeIcon
                            icon={
                            user && comment.likedBy.includes(user?._id)
                                ? faHeart
                                : faHeartOutline
                            }
                            onClick={
                            user && comment.likedBy.includes(user?._id)
                                ? (e) => handleUnlike(comment._id, e)
                                : (e) => handleLike(comment._id, e)
                            }
                        />{" "}
                        </div>
                    </div>
                    <div className="commentReply">
                        <FontAwesomeIcon icon={faComment} />
                        <span onClick={() => setIsReplyInputOpen(!isReplyInputOpen)}> Reply </span>
                    </div>
                    <div className="commentShare">
                        <FontAwesomeIcon icon={faShare} />
                        <span> Share </span>
                    </div>
                    </div>

                  {isReplyInputOpen && 
                    <div><textarea className="commentReplyTextArea" value={replyText} placeholder="Comment here" onChange={(e) => setReplyText(e.target.value)} />
                        <div className="commentReplyActions">
                        <button onClick={(e) => handleReply()}> Send</button>
                        <button> Cancel</button>
                        </div>
                    </div>}
              
              </div>
              <div className="repliesContainer">
                {comments.map((reply) => (
                    <Comment
                    key={reply._id}
                    comment={reply}
                    handleLike={handleLike}
                    handleUnlike={handleUnlike}
                    comments={reply.comments}
                    indent={indent + 1}
                    />))}
              </div>

            </>

    );
};

export default Comment;