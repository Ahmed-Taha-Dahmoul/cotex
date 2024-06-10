import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the useAuth hook
import './CommentSection.css'; // Import CSS file for styling
import LoginForm from '../LoginForm/LoginForm'; // Import LoginForm component

const CommentSection = ({ gameId }) => {
  const { isLoggedIn } = useAuth(); // Use the useAuth hook to get login status
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showLogin, setShowLogin] = useState(false); // State to control login modal visibility

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/comments/', {
          params: { game: gameId }
        });
        setComments(response.data.results); // Assuming comments are nested under 'results'
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [gameId]);

  const handleLikeToggle = (commentId) => {
    // Handle like toggle logic here
    // You can use this function to update the liked status of a comment
  };

  const handleDislikeToggle = (commentId) => {
    // Handle dislike toggle logic here
    // You can use this function to update the disliked status of a comment
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    try {
      // Assuming there's an API endpoint to post comments
      const response = await axios.post('http://localhost:8000/comments/add', {
        gameId: gameId,
        text: newComment // Assuming your API expects a 'text' field for comment
      });
      setComments([...comments, response.data]); // Assuming response.data contains the newly added comment
      setNewComment(''); // Clear input field after submission
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div className={`comment-section ${showLogin ? 'blur-background' : ''}`}>
      <h2>Comments</h2>
      <ul className="comment-list">
        {/* Ensure comments is an array before mapping */}
        {Array.isArray(comments) &&
          comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              {/* Comment content */}
              <div className="comment-info">
                <div className='user-username'>
                  <strong>{comment.user.username}</strong>
                </div>
                <div className="user-avatar">
                  <img src={comment.user.profile_pic} alt="Profile" />
                </div>
                <div className="comment-content">
                  <p>{comment.text}</p>
                  <span className="comment-time">{new Date(comment.time).toLocaleString()}</span>
                </div>
              </div>
              {/* Like button */}
              <label className="like-container">
                <input type="checkbox" onChange={() => handleLikeToggle(comment.id)} />
                <svg id="LikeGlyph" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.845,17.099l-2.489,8.725C26.989,27.105,25.804,28,24.473,28H11c-0.553,0-1-0.448-1-1V13  c0-0.215,0.069-0.425,0.198-0.597l5.392-7.24C16.188,4.414,17.05,4,17.974,4C19.643,4,21,5.357,21,7.026V12h5.002  c1.265,0,2.427,0.579,3.188,1.589C29.954,14.601,30.192,15.88,29.845,17.099z" />
                  <path d="M7,12H3c-0.553,0-1,0.448-1,1v14c0,0.552,0.447,1,1,1h4c0.553,0,1-0.448,1-1V13C8,12.448,7.553,12,7,12z   M5,25.5c-0.828,0-1.5-0.672-1.5-1.5c0-0.828,0.672-1.5,1.5-1.5c0.828,0,1.5,0.672,1.5,1.5C6.5,24.828,5.828,25.5,5,25.5z" />
                </svg>
              </label>
              {/* Dislike button */}
              <label className="dislike-container">
                <input type="checkbox" onChange={() => handleDislikeToggle(comment.id)} />
                <svg id="DislikeGlyph" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.156,14.901l2.489-8.725C5.012,4.895,6.197,4,7.528,4h13.473C21.554,4,22,4.448,22,5v14  c0,0.215-0.068,0.425-0.197,0.597l-5.392,7.24C15.813,27.586,14.951,28,14.027,28c-1.669,0-3.026-1.357-3.026-3.026V20H5.999  c-1.265,0-2.427-0.579-3.188-1.589C2.047,17.399,1.809,16.156,14.901z" />
                  <path d="M25.001,20h4C29.554,20,30,19.552,30,19V5c0-0.552-0.446-1-0.999-1h-4c-0.553,0-1,0.448-1,1v14  C24.001,19.552,24.448,20,25.001,20z M27.001,6.5c0.828,0,1.5,0.672,1.5,1.5c0,0.828-0.672,1.5-1.5,1.5c-0.828,0-1.5-0.672-1.5-1.5  C25.501,7.172,26.173,6.5,27.001,6.5z" />
                </svg>
              </label>
            </li>
          ))}
      </ul>
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Submit</button>
      </form>
      {showLogin && (
        <div className="login-modal">
          <button className="close-button" onClick={handleCloseLogin}>X</button>
          <LoginForm />
        </div>
      )}
    </div>
  );
};

export default CommentSection;
