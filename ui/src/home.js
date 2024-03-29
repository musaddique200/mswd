import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ loggedIn, email, setLoggedIn }) => {
  const navigate = useNavigate();

  const onButtonClick = () => {
    if (loggedIn) {
      // Perform logout logic
      setLoggedIn(false);
      navigate('/login');
    } else {
      // Navigate to the login page
      navigate('/login');
    }
  };

  return (
    <div className="mainContainer">
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item"><a href="/" className="navLink">Home</a></li>
          <li className="nav-item"><a href="/products" className="navLink">Products</a></li>
          <li className="nav-item"><a href="/sell-item" className="navLink">Sell Item</a></li>
          {loggedIn ? (
            <>
              <li className="nav-item"><a href="/profile" className="navLink">Profile</a></li>
              <li className="nav-item"><button onClick={onButtonClick} className="logoutButton">Log out</button></li>
            </>
          ) : (
            <li className="nav-item"><a href="/login" className="navLink">Log in / Register</a></li>
          )}
        </ul>
      </nav>
      <div className="titleContainer">
        <div>Welcome to the Used Goods Marketplace!</div>
      </div>
      <div className="descriptionContainer">
        <p>
          Buy and sell pre-owned items with ease on our platform. Discover great deals or turn your unused items into cash!
        </p>
      </div>
      <div className="buttonContainer">
        <input
          className="inputBox"
          type="submit"
          onClick={onButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
        />
        {loggedIn ? <div>Your email address is {email}</div> : <div />}
      </div>
    </div>
  );
};

export default Home;
