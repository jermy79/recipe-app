import React from 'react';
import '../CSS/App.css';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
      <div>
        <Navbar />
        <div className='welcomeText'>
            <h1>test</h1>
        </div>
      </div>
    );
};

export default Home;