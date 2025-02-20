import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/App.css';
import '../CSS/RecipeDetail.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

// Helper function to replace newlines with <br /> tags
const newlineToBreak = (text) => {
    if (!text) return null; // Handle undefined or null text
    return text.split('\n').map((item, index) => (
        <span key={index}>
            {item}
            <br />
        </span>
    ));
};

const RecipeDetail = () => {
    const { id } = useParams(); // Get the recipe ID from the URL
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        // Fetch recipe details based on the ID
        const fetchRecipeDetails = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`http://localhost:4000/api/recipes/${id}`, {
                    headers: {
                        'Authorization': token
                    }
                });
                const data = await response.json();
                if (data && typeof data === 'object') {
                    setRecipe(data);
                } else {
                    setRecipe(null);
                }
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            }
        };

        fetchRecipeDetails();
    }, [id]); // Re-fetch if the `id` changes

    if (!recipe) return <p>Loading...</p>;

    return (
        <div>
            <Navbar />
            <div className="recipeDetail">
                <h1>{recipe.title || 'No Title'}</h1>
                <h3>Ingredients:</h3>
                <div>{recipe.ingredients ? newlineToBreak(recipe.ingredients) : 'No ingredients available'}</div>
                <h3>Steps:</h3>
                <div>{recipe.steps ? newlineToBreak(recipe.steps) : 'No steps available'}</div>
            </div>
        </div>
    );
};

export default RecipeDetail;
