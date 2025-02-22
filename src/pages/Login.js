import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../CSS/App.css';
import '../CSS/Login.css';
import food from '../media/foodLogin.webp';
import logo from '../media/RezepeLogo.png';

const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.isRegistering) {
            setIsRegistering(true);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://api.rezepe.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                navigate('/home');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('https://api.rezepe.com/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                setIsRegistering(false);
                setError('');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className='login-container'>
    <div className='picture'>
        <img src={food} alt="Food" />
    </div>
    <div className='login-card'>
        {/* Logo Above the Form */}
        <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />  {/* Add your logo here */}
        </div>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            )}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {isRegistering && (
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            )}
            <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="toggle-links">
            {isRegistering ? (
                <p>Already have an account? <span className="link" onClick={() => setIsRegistering(false)}>Login here</span></p>
            ) : (
                <p>Don't have an account? <span className="link" onClick={() => setIsRegistering(true)}>Register here</span></p>
            )}
        </div>
    </div>
</div>

    );
};

export default Login;
