import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/App.css';
import '../CSS/CreateRecipe.css';
import Navbar from '../components/Navbar';

const CreateRecipe = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState(null); // New state for image upload
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('https://api.rezepe.com/api/user', {
                    headers: {
                        'Authorization': token
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setUserId(data.id);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file); // Store the selected image file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // Prepare form data for multipart upload
        const formData = new FormData();
        formData.append('title', title);
        formData.append('ingredients', ingredients);
        formData.append('steps', steps);
        if (image) {
            formData.append('image', image); // Append image if selected
        }

        try {
            const response = await fetch('https://api.rezepe.com/api/recipes', {
                method: 'POST',
                headers: {
                    'Authorization': token // Do NOT set 'Content-Type', it will be auto-set by FormData
                },
                body: formData,
            });

            if (response.ok) {
                const newRecipe = await response.json();
                navigate(`/recipe/${newRecipe.id}`, { replace: true });
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
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <div>
                        <label>Upload Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button type="submit">Create Recipe</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipe;
