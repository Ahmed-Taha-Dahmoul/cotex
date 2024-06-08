import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ gameId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/comments/', {
          params: { game: gameId }
        });
        setComments(response.data.results); // Assuming comments are nested under 'results'
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [gameId]);

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      <ul>
        {/* Ensure comments is an array before mapping */}
        {Array.isArray(comments) && comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.text}</p>
            {/* Render other comment details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
