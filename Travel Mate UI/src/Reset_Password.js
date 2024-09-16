import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer from react-toastify
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.scss'; 

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Add the class to the body element when the component mounts
    document.body.classList.add('reset-password-page');

    // Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove('reset-password-page');
    };
  }, []);
  
  // Function to extract token from the URL
  const extractTokenFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  };

  // Extract the token from the URL
  const token = extractTokenFromURL();
  console.log(token);

  const handleResetPassword = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Include the token in the API request
      const response = await axios.post(`http://localhost:3001/controllers/Reset_Password`, { token, password });

      setMessage(response.data.message);
      setError('');
      // Show success toast
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
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="reset-password-box">
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button className='Reset Password' onClick={handleResetPassword}>Reset Password</button>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <ToastContainer />
    </div>
    </div>
  );
}

export default ResetPassword;
