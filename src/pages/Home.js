import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../CSS/App.css';
import '../CSS/Home.css';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [userName, setUserName] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
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
                    headers: { 'Authorization': token }
                });
                const data = await response.json();
                if (response.ok) setUserName(data.name);
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
                    headers: { 'Authorization': token }
                });

                const data = await response.json();
                if (response.ok) setRecipes(data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchUserData();
        fetchRecipes();

        // Event listener to detect clicks outside the recipe card
        const handleClickOutside = (event) => {
            if (!event.target.closest('.recipeCard')) {
                setSelectedRecipe(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [navigate]);

    // Toggle right-click menu (replaces ingredients with buttons)
    const handleContextMenu = (e, recipe) => {
        e.preventDefault();
        setSelectedRecipe((prev) => (prev?.id === recipe.id ? null : recipe));
    };

    // Handle edit navigation
    const handleEdit = (e, recipeId) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(`/edit-recipe/${recipeId}`);
    };

    // Handle delete
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');

        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:4000/api/recipes/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });

                if (response.ok) {
                    setRecipes(recipes.filter(recipe => recipe.id !== id));
                    setSelectedRecipe(null);
                } else {
                    console.error('Failed to delete recipe');
                }
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="welcomeText">
                <h1>{userName ? `${userName}'s Recipes` : 'Recipes'}</h1>
            </div>
            <div className="recipeList">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="recipeCard"
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                            onContextMenu={(e) => handleContextMenu(e, recipe)}
                        >
                            <h3>{recipe.title}</h3>

                            {/* Show buttons if recipe is right-clicked, otherwise show ingredients */}
                            {selectedRecipe?.id === recipe.id ? (
                                <div className="recipeActions">
                                    <button onClick={(e) => handleEdit(e, recipe.id)}>Edit</button>
                                    <button className="deleteBtn" onClick={(e) => handleDelete(e, recipe.id)}>Delete</button>
                                </div>
                            ) : (
                                <p>{recipe.ingredients}</p>
                            )}
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
