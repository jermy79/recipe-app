import React from 'react';
import '../CSS/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome'
import Home from './Home'
import Login from './Login'
import Navbar from '../components/Navbar';

function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
    </Routes>
</Router>
  );
}

export default App;
