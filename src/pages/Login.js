import React from 'react';
import '../CSS/App.css';
import food from'../media/foodLogin.jpg'

const Home = () => {
    return (
      <div>
        <div className='picture'>
            <img src={food}></img>
        </div>
        <div className='login'>
           <h1>Login</h1>
        </div>
      </div>
    );
};

export default Home;