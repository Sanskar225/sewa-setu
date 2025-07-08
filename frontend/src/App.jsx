// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile'; 
import ProviderProfile from './pages/ProviderProfile';
import Booking from './pages/Booking';
import Reviews from './pages/Reviews';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import './styles/App.css'; 

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<UserProfile />} /> {}
            <Route path="/provider/:id" element={<ProviderProfile />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
