import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './home'
import Register from './register'
import Login from './login'

import './App.css'
import { useState } from 'react'
//import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App