import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner } from 'react-bootstrap';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/games/${id}/`);
        setGame(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  return (
    <Container>
      <h1>Game Details</h1>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Card>
          <Card.Img variant="top" src={`http://localhost:8000/${game.image_path}`} />
          <Card.Body>
            <Card.Title>{game.title}</Card.Title>
            <Card.Text>{game.description}</Card.Text>
            {/* Add more game details as needed */}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default GameDetail;
