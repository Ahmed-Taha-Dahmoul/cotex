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
import NotFound from './components/NotFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="App">
        <Header />
        <div className="background-wrapper">
          <div className="blurred-background"></div>
          <main className="main-content">
              <Routes>
                <Route path="/" element={<GameList />} />
                <Route path="/games/:id" element={<GameDetail />} />
                <Route path="/category" element={<CategoryResults />} />
                <Route path="/search_result" element={<SearchResults />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/login" element={<PublicRoute element={<LoginForm />} />} />
                <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/online-games" element={<OnlineGames />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
