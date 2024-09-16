import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer from react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from 'react-icons/fa'; // Import the arrow icon from react-icons
import './ForgotPassword.scss'; // Import the SCSS file for styling
import { useHistory } from 'react-router-dom';


function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleForgotPassword = async () => {
    try {
      // Validate email format
      if (!emailIsValid(email)) {
        setError('Please enter a valid email address');
        return;
      }

      const response = await axios.post('http://localhost:3001/controllers/forgot_password', { email });
      setMessage(response.data.message);
      setError('');
      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        setError(error.response.data.error);
        // Show error toast
        toast.error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Network error. Please try again.');
        // Show error toast
        toast.error('Network error. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again later.');
        // Show error toast
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  // Function to validate email format
  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNavigateBack = () => {
    history.push('/login');
  };

  return (
    <div className="forgot-password-container">
      <FaArrowLeft className="back-to-login-btn" onClick={handleNavigateBack} />
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <p>Enter your email and we'll send you a link to reset your password.</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button className='forgotpass' onClick={handleForgotPassword}>Submit</button>
        {message && <p className="message">{message}</p>}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
