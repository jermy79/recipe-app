import React from 'react';
import '../CSS/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome'
import Home from './Home'
import Login from './Login'
import RecipeDetail from './RecipeDetail';
import CreateRecipe from './CreateRecipe';


function App() {

  return (
    <Router>
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/create" element={<CreateRecipe />} />
    </Routes>
</Router>
  );
}

export default App;
