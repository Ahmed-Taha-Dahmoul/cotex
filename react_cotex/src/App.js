// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList/GameList';
import GameDetail from './components/GameDetail/GameDetail';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SearchResults from './components/SearchResults/SearchResults';
import SignUpForm from './components/SignUpForm/SignUpForm';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

// Assuming AuthProvider manages authentication state
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
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
              <Route path="/login" element={<LoginForm />} />
              <Route path="/profile" element={<PrivateRoute element={Profile} />} /> {/* Protected Route */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
