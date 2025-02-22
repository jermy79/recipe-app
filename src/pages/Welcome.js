import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/App.css';
import '../CSS/Welcome.css';
import food from '../media/food.png';
import Navbar from '../components/Navbar';  

const Welcome = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignUp = () => {
        navigate('/login', { state: { isRegistering: true } });
    };

    return (
      <>
        <Navbar />
        <div className='container'>
          <div className='pic'><img src={food} alt="Food" /></div>
          <div className='welcomeText'>
            <h1>Welcome to your simple recipe storage app</h1>
            <p>Rezepe is a simple and intuitive recipe management app designed to help you organize all your favorite recipes in one place. With an easy-to-use interface, ReZePe allows you to add, store, and access your recipes anytime. Whether you're keeping track of tried-and-true favorites or experimenting with new dishes, ReZePe makes it simple to store ingredients, instructions, and personal notes for every recipe. </p>
            <div className="button-container">
              <button className="btn" onClick={handleLogin}>Login</button>
              <button className="btn" onClick={handleSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </>
    );
};

export default Welcome;
