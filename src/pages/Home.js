import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../CSS/App.css';
import '../CSS/Home.css';
import Navbar from '../components/Navbar';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Fetch recipes from the backend
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/recipes');
                const data = await response.json();
                setRecipes(data); // Set the fetched recipes
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    // Function to truncate ingredient list
    const truncateIngredients = (ingredients, maxLength = 50) => {
        if (!ingredients) return "No ingredients listed";
        return ingredients.length > maxLength 
            ? ingredients.substring(0, maxLength) + "..." 
            : ingredients;
    };

    return (
        <div>
            <Navbar />
            <div className="welcomeText">
                <h1>Recipes for John Doe</h1>
            </div>
            <div className="recipeList">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div 
                            key={recipe.id} 
                            className="recipeCard"
                            onClick={() => navigate(`/recipe/${recipe.id}`)} // Clickable card
                        >
                            <h3>{recipe.title}</h3>
                            <p className="ingredientPreview">
                                {truncateIngredients(recipe.ingredients)}
                            </p>
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
