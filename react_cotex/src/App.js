import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GameList from './components/GameList/GameList';
import GameDetail from './components/Gamedetail/GameDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/games/:id" element={<GameDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
