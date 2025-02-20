import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/App.css';
import Navbar from '../components/Navbar';

const CreateRecipe = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [pictures, setPictures] = useState('');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the recipe data to the backend
        const recipeData = {
            title,
            ingredients,
            steps,
            pictures, // Pictures can be a comma-separated string
            user_id: 1, // Hardcoded for John Doe (user_id = 1)
        };

        try {
            const response = await fetch('http://localhost:4000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
            });

            if (response.ok) {
                // Redirect to the home page or recipe list page after the recipe is created
                history.push('/');
            } else {
                alert('Error adding recipe');
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="createRecipeForm">
                <h1>Create New Recipe</h1>
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
                        />
                    </div>
                    <div>
                        <label>Steps:</label>
                        <textarea
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Pictures (comma-separated URLs):</label>
                        <input
                            type="text"
                            value={pictures}
                            onChange={(e) => setPictures(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Create Recipe</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipe;
