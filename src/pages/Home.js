import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../CSS/App.css';
import '../CSS/Home.css'
import Navbar from '../components/Navbar';

const Home = () => {
    const [recipes, setRecipes] = useState([]);

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

    return (
        <div>
            <Navbar />
            <div className="welcomeText">
                <h1>Recipes for John Doe</h1>
            </div>
            <div className="recipeList">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe.id} className="recipeCard">
                            <h3>{recipe.title}</h3>
                            <div className="recipeImage">
                                {/* Link to the recipe details page */}
                                <Link to={`/recipe/${recipe.id}`}>
                                    {recipe.pictures && (
                                        <img
                                            src={recipe.pictures.split(',')[0]}
                                            alt={recipe.title}
                                        />
                                    )}
                                </Link>
                            </div>
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
