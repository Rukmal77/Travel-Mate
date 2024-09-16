import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Travelrecommendation.scss';
import { FaArrowLeft } from 'react-icons/fa';
import Cookies from 'js-cookie';

const checkAuthToken = async () => {
  console.log('All cookies:', document.cookie);
  const token = Cookies.get('token');
  console.log('Token from cookies:', token);
  if (!token) {
    console.log('No token found in cookies.');
    return false;
  }

  try {
    const response = await axios.post(
      'http://localhost:3001/controllers/authRouter',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log('Server response:', response.data);
    return response.data.isValid;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

const RecipeCard = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`recipe-card ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      <img src={recipe.image_link} alt={recipe.Name} />
      <h2>{recipe.Name}</h2>
      {isExpanded && (
        <div className="details">
          <p><strong>Cook Time:</strong> {recipe.CookTime}</p>
          <p><strong>Prep Time:</strong> {recipe.PrepTime}</p>
          <p><strong>Total Time:</strong> {recipe.TotalTime}</p>
          <h3>Ingredients:</h3>
          <ul>
            {recipe.RecipeIngredientParts.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <p><strong>Calories:</strong> {recipe.Calories}</p>
          <p><strong>Fat Content:</strong> {recipe.FatContent}</p>
          <p><strong>Saturated Fat Content:</strong> {recipe.SaturatedFatContent}</p>
          <p><strong>Cholesterol Content:</strong> {recipe.CholesterolContent}</p>
          <p><strong>Sodium Content:</strong> {recipe.SodiumContent}</p>
          <p><strong>Carbohydrate Content:</strong> {recipe.CarbohydrateContent}</p>
          <p><strong>Fiber Content:</strong> {recipe.FiberContent}</p>
          <p><strong>Sugar Content:</strong> {recipe.SugarContent}</p>
          <p><strong>Protein Content:</strong> {recipe.ProteinContent}</p>
          <h3>Instructions:</h3>
          <ol>
            {recipe.RecipeInstructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

const RecipeList = ({ recipes }) => {
  return (
    <div className="recipe-list">
      {recipes.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.map((recipe, recipeIndex) => (
            <RecipeCard key={recipeIndex} recipe={recipe} />
          ))}
        </div>
      ))}
    </div>
  );
};

const UserForm = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [weightLossPlan, setWeightLossPlan] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState('');
  const [bmiResult, setBmiResult] = useState('');
  const [bmr, setBmr] = useState(''); // Initialize state for BMR
  const [calories, setCalories] = useState(''); // Initialize state for calories
  const [recommendations, setRecommendations] = useState([]); // Initialize state for recommendations
  const history = useHistory();

  useEffect(() => {
    const verifyToken = async () => {
        const isAuthenticated = await checkAuthToken();
        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to dashboard.');
            history.push('/dashboard');
        }
    };

    verifyToken();
}, [history]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/controllers/TravelRecommendation/calculate', {
        age,
        height,
        weight,
        gender,
        activityLevel,
        weightLossPlan,
        mealsPerDay,
      });
      const { bmiResult, bmr, calories } = response.data;
      setBmiResult(bmiResult);
      setBmr(bmr);
      setCalories(calories);

      let mealsCaloriesPerc;
      const mealsPerDayNumber = parseInt(mealsPerDay, 10);
      if (mealsPerDayNumber === 3) {
        mealsCaloriesPerc = { breakfast: 0.35, lunch: 0.40, dinner: 0.25 };
      } else if (mealsPerDayNumber === 4) {
        mealsCaloriesPerc = { breakfast: 0.30, 'morning snack': 0.05, lunch: 0.40, dinner: 0.25 };
      } else {
        mealsCaloriesPerc = { breakfast: 0.30, 'morning snack': 0.05, lunch: 0.40, 'afternoon snack': 0.05, dinner: 0.20 };
      }

      const recommendationsResponse = await axios.post('http://localhost:3001/controllers/TravelRecommendation/recommendations', {
        weightLoss: weightLossPlan,
        mealsCaloriesPerc: mealsCaloriesPerc,
        Calories: calories
      });
      setRecommendations(recommendationsResponse.data.recommendations);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleNavigateHome = () =>{
    history.push('/dashboard', { fromRecommendation: true });
  }

  return (
    <div className="travel-recommendation-page">
      <FaArrowLeft className="navigate-home-btn" onClick={handleNavigateHome} />
      <h1>Travel Mate</h1>
      <p>Discover exciting new destinations tailored to your interests and preferences!</p>
      
      <form onSubmit={handleSubmit}>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Provience</option>
          <option value="Male">1day</option>
          <option value="Female">more than 1 day</option>
        </select>

         <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Weather type</option>
          <option value="Male">1day</option>
          <option value="Female">more than 1 day</option>
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Budget</option>
          <option value="Male">1day</option>
          <option value="Female">more than 1 day</option>
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Duration to stay</option>
          <option value="Male">1day</option>
          <option value="Female">more than 1 day</option>
        </select>

        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
        >
          <option value="">Activities</option>
          <option value="Little/no exercise">Little/no exercise</option>
          <option value="Light exercise">Light exercise</option>
        </select>
       
      
        <button type="submit">Submit</button>
        {bmiResult && <p>BMI Result: {bmiResult}</p>}
        {bmr && <p>BMR: {bmr}</p>}
        {calories && <p>Calories: {calories}</p>}
        {recommendations.length > 0 && <RecipeList recipes={recommendations} />}
      </form>
    </div>
  );
};

export default UserForm;
