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

  const handleLikeToggle = async (commentId) => {
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
      // Call fetchComments or any other function to update comments
      fetchComments();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislikeToggle = async (commentId) => {
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
          // Remove from likedComments if it was liked before
          setLikedComments((prevLikedComments) => {
            const newLikedComments = new Set(prevLikedComments);
            newLikedComments.delete(commentId);
            return newLikedComments;
          });
        }
        return newDislikedComments;
      });
  
      // Call fetchComments or any other function to update comments
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
          parent: null,
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
  
        const newCommentData = processCommentData(response.data);
        setComments([newCommentData, ...comments]);
        setReplyingTo(null);

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

    const handleReport = (commentId) => {
      // Handle report logic here
      console.log('Report comment:', commentId);
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
          <li key={comment.id} className="comment-item">
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
              <ThreeDotsMenu onReport={() => handleReport(comment.id)} />
            </div>
            <div className="comment-actions">
              <div className="like-container">
                <LikeButton
                  commentId={comment.id}
                  handleLikeToggle={handleLikeToggle}
                  isLiked={likedComments.has(comment.id)}
                  likesCount={comment.likes_count}
                  updateLikesCount={fetchComments} // Pass fetchComments or any other function to update likes count
                  />
                  <DislikeButton
                  commentId={comment.id}
                  handleDislikeToggle={handleDislikeToggle}
                  isDisliked={dislikedComments.has(comment.id)}
                  dislikesCount={comment.dislikes_count}
                  updateDislikesCount={fetchComments} // Pass fetchComments or any other function to update dislikes count
                  />
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
                        <li key={comment.id} className="comment-item">
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
                            <ThreeDotsMenu onReport={() => handleReport(comment.id)} />
                            <div className="like-wrapper">
                              <div className="like-container">
                                <span className="like-count">{comment.likes_count}</span>
                                <LikeButton
                                  commentId={comment.id}
                                  handleLikeToggle={handleLikeToggle}
                                  isLiked={likedComments.has(comment.id)}
                                  updateLikesCount={fetchComments} // Pass fetchComments or any other function to update likes count
                                />
                              </div>
                              <div className="dislike-container">
                                <span className="dislike-count">{comment.dislikes_count}</span>
                                <DislikeButton
                                  commentId={comment.id}
                                  handleDislikeToggle={handleDislikeToggle}
                                  isDisliked={dislikedComments.has(comment.id)}
                                  updateDislikesCount={fetchComments} // Pass fetchComments or any other function to update dislikes count
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
                            <button className="close-button" onClick={handleCloseLogin}>X</button>
                            <LoginForm />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  

                };

                export default CommentSection;
