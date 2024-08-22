// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList/GameList';
import GameDetail from './components/GameDetail/GameDetail';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SearchResults from './components/SearchResults/SearchResults';
import CategoryResults from './components/CategoryResults/CategoryResults';
import SignUpForm from './components/SignUpForm/SignUpForm';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider } from './components/AuthContext';
import FAQ from './components/FAQ/FAQ';
import OnlineGames from './components/OnlineGames/OnlineGames';
import AboutUs from './components/AboutUs/AboutUs';
import Container from './components/Container/Container';
import Home from './Pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Container>
            <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/new" element={<GameList />} />
              <Route path="/games/:id" element={<GameDetail />} />
              <Route path="/category" element={<CategoryResults />} />
              <Route path="/action" element={<div>Action Games</div>} />
              <Route path="/adventure" element={<div>Adventure Games</div>} />
              <Route path="/simulation" element={<div>Simulation Games</div>} />
              <Route path="/multiplayer" element={<div>Multiplayer Games</div>} />
              <Route path="/search_result" element={<SearchResults />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/login" element={<PublicRoute element={<LoginForm />} />} />
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
              <Route path="/FAQ" element={<FAQ/>} />
              <Route path="/online-games" element={<OnlineGames/>} />
              <Route path="/about-us" element={<AboutUs/>} />
            </Routes>
            </Container>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
