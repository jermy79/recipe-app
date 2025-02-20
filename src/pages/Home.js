import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../CSS/App.css';
import '../CSS/Home.css';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:4000/api/user', {
                    headers: {
                        'Authorization': token // Include the token in the request header
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setUserName(data.name); // Set the logged-in user's name
                } else {
                    console.error(data.message);
                    // Handle error if needed
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchRecipes = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:4000/api/recipes', {
                    headers: {
                        'Authorization': token
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setRecipes(data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchUserData();
        fetchRecipes();
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <div className="welcomeText">
                <h1>{userName ? `${userName}'s Recipes` : 'Recipes'}</h1> {/* Display logged-in user's name */}
            </div>
            <div className="recipeList">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="recipeCard"
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                        >
                            <h3>{recipe.title}</h3>
                            <p>{recipe.ingredients}</p> {/* Show truncated ingredients */}
                        </div>
                    ))
                ) : (
                    <p>No recipes found</p>
                )}
            </div>
        </div>
    );
};

export default Home;
