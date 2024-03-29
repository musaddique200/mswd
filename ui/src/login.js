import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onButtonClick = () => {
    // Set initial error values to empty
    setUsernameError('');
    setPasswordError('');

    // Check if the user has entered both fields correctly
    if ('' === formData.username) {
      setUsernameError('Please enter your username');
      return;
    }

    if ('' === formData.password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    // Authentication calls will be made here...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      if (response.status === 200) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error logging in:', error.response.data);
        setError('Error logging in');
      } else {
        console.error('Network error:', error.message);
        setError('Network error occurred');
      }
    }
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Login</div>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username here"
            className="inputBox"
          />
          {usernameError && <div className="errorLabel">{usernameError}</div>}
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password here"
            className="inputBox"
          />
          {passwordError && <div className="errorLabel">{passwordError}</div>}
        </div>
        <br />
        <div className={'inputContainer'}>
          <input className={'inputButton'} type="submit" onClick={onButtonClick} value={'Log in'} />
        </div>
      </form>
      {error && <div className="errorLabel">{error}</div>}
    </div>
  );
};

export default Login;
