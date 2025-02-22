import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../CSS/App.css';
import '../CSS/EditRecipe.css';

const EditRecipe = () => {
    const { id } = useParams(); // Get recipe ID from URL
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({ title: '', ingredients: '', steps: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            const token = localStorage.getItem('authToken');

            try {
                const response = await fetch(`https://api.rezepe.com/api/recipes/${id}`, {
                    headers: { 'Authorization': token }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recipe');
                }

                const data = await response.json();
                setRecipe(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`https://api.rezepe.com/api/recipes/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipe)
            });

            if (!response.ok) {
                throw new Error('Failed to update recipe');
            }

            navigate('/home'); // Redirect to home after successful edit
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <Navbar />
            <div className="createRecipeForm">
                <h1>Edit Recipe</h1>
                <form onSubmit={handleSubmit}>
                    <label>Recipe Title:</label>
                    <input type="text" name="title" value={recipe.title} onChange={handleChange} required />

                    <label>Ingredients:</label>
                    <textarea name="ingredients" value={recipe.ingredients} onChange={handleChange} required />

                    <label>Steps:</label>
                    <textarea name="steps" value={recipe.steps} onChange={handleChange} required />

                    <button type="submit">Save Changes</button>
                    <button type="button" className="cancelBtn" onClick={() => navigate('/home')}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditRecipe;
