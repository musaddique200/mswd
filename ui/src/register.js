import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (formData.username === '') {
      setUsernameError('Please enter your username');
      isValid = false;
    }

    if (formData.email === '') {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (formData.password === '') {
      setPasswordError('Please enter a password');
      isValid = false;
    } else if (formData.password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      isValid = false;
    }

    if (formData.confirmPassword === '') {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      if (response.status === 200) {
        navigate('/login'); // Assuming the user is redirected to login after registration
      } else {
        setError('An error occurred during registration');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error registering:', error.response.data);
        setError('Error registering');
      } else {
        console.error('Network error:', error.message);
        setError('Network error occurred');
      }
    }
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Register</div>
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
            placeholder="Username"
            className="inputBox"
          />
          {usernameError && <div className="errorLabel">{usernameError}</div>}
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="inputBox"
          />
          {emailError && <div className="errorLabel">{emailError}</div>}
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="inputBox"
          />
          {passwordError && <div className="errorLabel">{passwordError}</div>}
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="inputBox"
          />
          {confirmPasswordError && <div className="errorLabel">{confirmPasswordError}</div>}
        </div>
        <br />
        <div className="inputContainer">
          <input className="inputButton" type="submit" value="Register" />
        </div>
      </form>
      {error && <div className="errorLabel">{error}</div>}
    </div>
  );
};

export default Register;
