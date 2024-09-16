import React, { useState } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import './Login.scss'; // Assuming Login.scss exists for styling

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/controllers/login', {
        email,
        password,
      },{
        withCredentials: true, // Ensure cookies are included
    });

    console.log('Login response:', response);

      if (response.status === 200) {
        // Store the received token in localStorage
        localStorage.setItem('token', response.data.token);

        // Show success toast
        toast.success('Login successful!', {
          autoClose: 2000, // Close the toast after 2 seconds
        });

        // Delay redirection to the dashboard to allow the toast to show
        setTimeout(() => {
        history.push('/dashboard');
      }, 1000); // Delay for 1 second (1000 milliseconds)
      } else {
        setError(response.data.message || 'Login failed'); // Handle non-200 status codes gracefully
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed'); // More specific error handling
      // Show error toast
      toast.error('Login failed');
    }
  };

  const handleSignUpClick = () => {
    history.push('/signup');
  };
  const handleForgotPasswordClick = () => {
    history.push('/forgot_password');
  };

  const handleNavigateHome = () =>{
    history.push('/');
  }

  return (
    <div className="main-wrap">
      <FaArrowLeft className="navigate-home-btn" onClick={handleNavigateHome} />
  <div className="box-container">
    <div className="img-box"></div>
    <div className="form-wrap">
      <div className="top-signup">
        <span>Don't you have an account?</span>
        <a href="/signup" className="signup-btn">SIGN UP</a>
      </div>
      <div className="mid-container">
        <h1>Welcome Back</h1>
        
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit} action="" className="form">
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br /><br />
          <label htmlFor="password">Password:</label><br />
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Your password"
          /><br />
          <span><a href="/forgot_password" className="fg-pass">Forgot password?</a></span><br />
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
      <div className="login-with">
        <span>Login with</span>
        <a href="#"><img src="images/fb.png" alt="" /></a>
        <a href="#"><img src="images/google.png" alt="" /></a>
        <a href="#"><img src="images/twitter.png" alt="" /></a>
       
      </div>
    </div>
  </div>
  <ToastContainer />
</div>
  );
};
export default LoginPage;
