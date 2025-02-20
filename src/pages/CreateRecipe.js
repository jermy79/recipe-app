import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/App.css';
import '../CSS/CreateRecipe.css';
import Navbar from '../components/Navbar';

const CreateRecipe = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null); // User ID from the logged-in user

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
                        'Authorization': token
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setUserId(data.id); // Set userId from the fetched data
                } else {
                    setError(data.message || 'Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('An error occurred while fetching user data');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const recipeData = {
            title,
            ingredients,
            steps,
        };

        try {
            const response = await fetch('http://localhost:4000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token, // Add the token to the Authorization header
                },
                body: JSON.stringify(recipeData),
            });

            if (response.ok) {
                const newRecipe = await response.json();
                navigate(`/recipe/${newRecipe.id}`);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error adding recipe');
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            setError('An error occurred while creating the recipe');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="createRecipeForm">
                <h1>Create New Recipe</h1>
                {error && <p className="error">{error}</p>} {/* Display error if any */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Recipe Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Ingredients:</label>
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            required
                            rows="4"
                        />
                    </div>
                    <div>
                        <label>Steps:</label>
                        <textarea
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            required
                            rows="4"
                        />
                    </div>
                    <button type="submit">Create Recipe</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipe;
