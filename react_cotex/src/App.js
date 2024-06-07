import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList/GameList';
import GameDetail from './components/GameDetail/GameDetail';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SearchResults from './components/SearchResults/SearchResults';
import SignUpForm from './components/SignUpForm/SignUpForm';
import LoginForm from './components/LoginForm/LoginForm';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Define isLoggedIn state

  useEffect(() => {
    // Check if the user is already logged in (for example, by checking local storage)
    const userLoggedIn = localStorage.getItem('token');
    if (userLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Pass isLoggedIn state and setIsLoggedIn function to Header */}
          <main className='main'>
            <Routes>
              <Route path="/" element={<GameList />} />
              <Route path="/games/:id" element={<GameDetail />} />
              <Route path="/action" element={<div>Action Games</div>} />
              <Route path="/adventure" element={<div>Adventure Games</div>} />
              <Route path="/simulation" element={<div>Simulation Games</div>} />
              <Route path="/multiplayer" element={<div>Multiplayer Games</div>} />
              <Route path="/search_result" element={<SearchResults />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} /> {/* Pass setIsLoggedIn to LoginForm */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
