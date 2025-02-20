import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Use to get the dynamic `id` from the URL
import '../CSS/App.css';
import '../CSS/RecipeDetail.css'
import Navbar from '../components/Navbar';

const RecipeDetail = () => {
    const { id } = useParams(); // Get the recipe ID from the URL
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        // Fetch recipe details based on the ID
        const fetchRecipeDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/recipes/${id}`);
                const data = await response.json();
                setRecipe(data); // Store the recipe details
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
                <h1>{recipe.title}</h1>
                <div className="recipeImage">
                    {recipe.pictures && (
                        <img
                            src={recipe.pictures.split(',')[0]}
                            alt={recipe.title}
                        />
                    )}
                </div>
                <h3>Ingredients:</h3>
                <p>{recipe.ingredients}</p>
                <h3>Steps:</h3>
                <p>{recipe.steps}</p>
            </div>
        </div>
    );
};

export default RecipeDetail;
