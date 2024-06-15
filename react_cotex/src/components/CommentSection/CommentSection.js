import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './CommentSection.css';
import LoginForm from '../LoginForm/LoginForm';
import LikeButton from './LikeButton';
import DislikeButton from './DislikeButton';
import ReplyForm from './ReplyForm'; // Import the ReplyForm component

const CommentSection = ({ gameId }) => {
  const { isLoggedIn, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment we are replying to

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/comments/?game=${gameId}`);
        setComments(response.data.results);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [gameId]);

  const handleLikeToggle = (commentId) => {
    // Handle like toggle logic here
  };

  const handleDislikeToggle = (commentId) => {
    // Handle dislike toggle logic here
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:8000/comments/create/',
        {
          user: user.id,
          game: gameId,
          text: newComment,
          parent: null,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newCommentData = processCommentData(response.data);
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentReply = async (text, parentId) => {
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:8000/comments/create/',
        {
          user: user.id,
          game: gameId,
          text: text,
          parent: parentId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newCommentData = processCommentData(response.data);
      setComments([...comments, newCommentData]);
      setReplyingTo(null);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const processCommentData = (commentData) => {
    const profilePicUri = localStorage.getItem('profile_pic');
    const profilePicUrl = `http://localhost:8000/${profilePicUri}`;
    const username = localStorage.getItem('username');
    const currentTime = new Date().toISOString();
    return {
      ...commentData,
      user: {
        ...commentData.user,
        profile_pic: profilePicUrl,
        username: username,
      },
      time: currentTime,
    };
  };

  const renderMainComments = () => {
    return comments
      .filter((comment) => !comment.parent)
      .map((comment) => (
        <li key={comment.id} className="comment-item">
          {/* Render main comment */}
          <div className="comment-info">
            <div className="user-avatar">
              <img src={comment.user.profile_pic} alt="Profile" />
            </div>
            <div className="user-details">
              <strong className="user-username">{comment.user.username}</strong>
              <span className="comment-time">{new Date(comment.time).toLocaleString()}</span>
            </div>
          </div>
          <div className="comment-content">
            <p>{comment.text}</p>
            <div className="reply-button" onClick={() => handleReply(comment.id)}>
              Reply
            </div>
          </div>
          {/* Render like and dislike buttons */}
          <LikeButton commentId={comment.id} handleLikeToggle={handleLikeToggle} isLiked={comment.isLiked} />
          <DislikeButton commentId={comment.id} handleDislikeToggle={handleDislikeToggle} isDisliked={comment.isDisliked} />
          {/* Render replies */}
          <ul className="replies">
            {renderReplyComments(comment.id)}
          </ul>
          {/* Render reply form */}
          {replyingTo === comment.id && (
            <ReplyForm onSubmit={(text) => handleCommentReply(text, comment.id)} onCancel={handleCancelReply} />
          )}
        </li>
      ));
  };

  const renderReplyComments = (parentId) => {
    return comments
      .filter((comment) => comment.parent === parentId)
      .map((comment) => (
        <li key={comment.id} className="comment-item">
          {/* Render reply comment */}
          <div className="comment-info">
            <div className="user-avatar">
              <img src={comment.user.profile_pic} alt="Profile" />
            </div>
            <div className="user-details">
              <strong className="user-username">{comment.user.username}</strong>
              <span className="comment-time">{new Date(comment.time).toLocaleString()}</span>
            </div>
          </div>
          <div className="comment-content">
            <p>{comment.text}</p>
            <div className="reply-button" onClick={() => handleReply(comment.id)}>
              Reply
            </div>
          </div>
          {/* Render like and dislike buttons */}
          <LikeButton commentId={comment.id} handleLikeToggle={handleLikeToggle} isLiked={comment.isLiked} />
          <DislikeButton commentId={comment.id} handleDislikeToggle={handleDislikeToggle} isDisliked={comment.isDisliked} />
          {/* Render nested replies */}
          <ul className="replies">
            {renderReplyComments(comment.id)}
          </ul>
          {/* Render reply form */}
          {replyingTo === comment.id && (
            <ReplyForm onSubmit={(text) => handleCommentReply(text, comment.id)} onCancel={handleCancelReply} />
          )}
        </li>
      ));
  };

  const renderCommentForm = () => {
    if (!isLoggedIn()) {
      return (
        <div className="login-required">
          Please <button onClick={() => setShowLogin(true)}>login</button> to comment.
        </div>
      );
    }
    return (
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Submit</button>
      </form>
    );
  };

  return (
    <div className="comment-section">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Comments</h2>
      <ul className="comment-list">
        {renderMainComments()}
      </ul>
      {renderCommentForm()}
      {showLogin && (
        <div className="login-modal">
          <div className="login-modal-content">
            <button className="close-button" onClick={handleCloseLogin}>X</button>
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
