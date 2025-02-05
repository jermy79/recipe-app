import React from 'react';
import '../CSS/App.css';
import '../CSS/Login.css'
import food from'../media/foodLogin.webp';

const Login = () => {
    return (
      <div className='login-container'> {/* Add this class to the wrapper div */}
        <div className='picture'>
            <img src={food} alt="Food" />
        </div>
        <div className='login'>
           <h1>Login</h1>
           <button>test</button>
        </div>
      </div>
    );
};

export default Login;
