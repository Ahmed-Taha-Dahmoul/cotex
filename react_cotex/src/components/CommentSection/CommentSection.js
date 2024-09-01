import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './CommentSection.css';
import LoginForm from '../LoginForm/LoginForm';
import LikeButton from './LikeButton';
import DislikeButton from './DislikeButton';
import ReplyForm from './ReplyForm';
import ThreeDotsMenu from './ThreeDotsMenu';
import config from '../../config';

const CommentSection = ({ gameId }) => {
  const { isLoggedIn, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [likedComments, setLikedComments] = useState(new Set());
  const [dislikedComments, setDislikedComments] = useState(new Set());

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportCommentId, setReportCommentId] = useState(null); 

  const fetchComments = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await axios.get(`${config.API_URL}/comments/?game=${gameId}`, {
        headers: headers,
      });

      const fetchedComments = response.data.results;
      setComments(fetchedComments);

      const initialLikedComments = new Set();
      const initialDislikedComments = new Set();

      fetchedComments.forEach(comment => {
        if (comment.liked_disliked_by_user === true) {
          initialLikedComments.add(comment.id);
        } else if (comment.liked_disliked_by_user === false) {
          initialDislikedComments.add(comment.id);
        }
      });

      setLikedComments(initialLikedComments);
      setDislikedComments(initialDislikedComments);

    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [gameId]);


  useEffect(() => {
    fetchComments().then(() => {
      const scrollToCommentId = localStorage.getItem('scrollToCommentId');
      if (scrollToCommentId) {
        const element = document.getElementById(`comment-${scrollToCommentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        localStorage.removeItem('scrollToCommentId');
      }
    });
  }, [gameId]);
  

  const handleLikeToggle = async (commentId) => {
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      await axios.put(
        `${config.API_URL}/comments/${commentId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLikedComments((prevLikedComments) => {
        const newLikedComments = new Set(prevLikedComments);
        if (newLikedComments.has(commentId)) {
          newLikedComments.delete(commentId);
        } else {
          newLikedComments.add(commentId);
          setDislikedComments((prevDislikedComments) => {
            const newDislikedComments = new Set(prevDislikedComments);
            newDislikedComments.delete(commentId);
            return newDislikedComments;
          });
        }
        return newLikedComments;
      });
      fetchComments();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislikeToggle = async (commentId) => {
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      await axios.put(
        `${config.API_URL}/comments/${commentId}/dislike/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setDislikedComments((prevDislikedComments) => {
        const newDislikedComments = new Set(prevDislikedComments);
        if (newDislikedComments.has(commentId)) {
          newDislikedComments.delete(commentId);
        } else {
          newDislikedComments.add(commentId);
          setLikedComments((prevLikedComments) => {
            const newLikedComments = new Set(prevLikedComments);
            newLikedComments.delete(commentId);
            return newLikedComments;
          });
        }
        return newDislikedComments;
      });

      fetchComments();
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const response = await axios.post(
        `${config.API_URL}/comments/create/`,
        {
          user: user.id,
          game: gameId,
          text: newComment,
          parent: null, // This is a top-level comment
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newCommentData = processCommentData(response.data);
      setComments([newCommentData, ...comments]);
      setNewComment('');
      window.location.reload();
      // Optional: You might want to scroll to the new comment here
      // For example: 
      const newCommentElement = document.getElementById(`comment-${response.data.id}`);
       if (newCommentElement) {
         newCommentElement.scrollIntoView({ behavior: 'smooth' });
      }

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
        `${config.API_URL}/comments/create/`,
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
  
      // Update the comments state with the new reply
      const newCommentData = processCommentData(response.data);
      setComments([newCommentData, ...comments]);
      setReplyingTo(null);
  
      // Save the new comment ID to local storage before reload
      localStorage.setItem('scrollToCommentId', response.data.id);
  
      // Reload the page
      window.location.reload();
  
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

  const handleOpenReportModal = (commentId) => {
    setShowReportModal(true);
    setReportCommentId(commentId); 
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportReason(''); 
    setReportCommentId(null); 
  };

  const handleReport = async () => {
    if (!isLoggedIn() || !reportCommentId) {
      setShowLogin(true);
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const reportData = {
        reason: reportReason, 
      };

      const response = await axios.post(
        `${config.API_URL}/comments/${reportCommentId}/report/`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Report submitted:', response.data);
      handleCloseReportModal(); 
    } catch (error) {
      console.error('Error reporting comment:', error.response ? error.response.data : error.message);
    }
  };


  const processCommentData = (commentData) => {
    const profilePicUri = localStorage.getItem('profile_pic');
    const profilePicUrl = `${config.API_URL}/${profilePicUri}`;
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
        <li key={comment.id} className="comment-item" id={`comment-${comment.id}`}>
          <div className='comment'>
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
            <ThreeDotsMenu onReport={() => handleOpenReportModal(comment.id)} />
          </div>
          <div className="comment-actions">
            <div className="like-container">
              <LikeButton
                commentId={comment.id}
                handleLikeToggle={handleLikeToggle}
                isLiked={likedComments.has(comment.id)}
                likesCount={comment.likes_count}
                updateLikesCount={fetchComments} 
              />
              <DislikeButton
                commentId={comment.id}
                handleDislikeToggle={handleDislikeToggle}
                isDisliked={dislikedComments.has(comment.id)}
                dislikesCount={comment.dislikes_count}
                updateDislikesCount={fetchComments} 
              />
            </div>
          </div>
          </div>
          <ul className="replies">
            {renderReplyComments(comment.id)}
          </ul>
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
        <li key={comment.id} className="comment-item" id={`comment-${comment.id}`}> 
        <div className='comment'>
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
            <ThreeDotsMenu onReport={() => handleOpenReportModal(comment.id)} />
          </div>
          <div className="comment-actions">
            <div className="like-container">
              <LikeButton
                commentId={comment.id}
                handleLikeToggle={handleLikeToggle}
                isLiked={likedComments.has(comment.id)}
                likesCount={comment.likes_count}
                updateLikesCount={fetchComments} 
              />
              <DislikeButton
                commentId={comment.id}
                handleDislikeToggle={handleDislikeToggle}
                isDisliked={dislikedComments.has(comment.id)}
                dislikesCount={comment.dislikes_count}
                updateDislikesCount={fetchComments} 
              />
            </div>
          </div>
          </div>
          <ul className="replies">
            {renderReplyComments(comment.id)}
          </ul>
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
      {renderCommentForm()}
      <ul className="comment-list">
        {renderMainComments()}
      </ul>
      {showLogin && (
        <div className="login-modal">
          <div className="login-modal-content">
            <button className="close-button-1-azs" onClick={handleCloseLogin}>X</button>
            <LoginForm />
          </div>
        </div>
      )}

       {showReportModal && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <h3>Report Comment</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Reason for reporting..."
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleCloseReportModal}>Cancel</button>
              <button onClick={handleReport}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;