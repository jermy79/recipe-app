import React from 'react';
import '../CSS/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome'
import Navbar from '../components/Navbar';

function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
        <Route path="/" element={<Welcome />} />
    </Routes>
</Router>
  );
}

export default App;
