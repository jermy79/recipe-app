import React from 'react';
import '../CSS/App.css';
import '../CSS/Welcome.css'
import food from '../media/food.png'
import Navbar from '../components/Navbar';  

const Welcome = () => {
    return (
      <>
        <Navbar />
        <div className='container'>
          <div className='pic'><img src={food}></img></div>
          <div className='welcomeText'>
            <h1>Welcome to your simple recipe storage app</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis eros id metus tristique elementum vitae eget nulla. Fusce sit amet maximus nulla, eget egestas mi. Nullam suscipit lacinia maximus. Ut rhoncus neque ac posuere malesuada. Donec ligula lacus, iaculis quis lobortis non, lobortis condimentum turpis. Nulla vitae bibendum ligula. Etiam congue suscipit ligula, quis tincidunt enim. Etiam pulvinar viverra rutrum.</p>
          </div>
        </div>
      </>

    );
};

export default Welcome;