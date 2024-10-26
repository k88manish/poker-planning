import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Room from './components/Room'
import JoinRoom from './components/JoinRoom'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/join/:roomId" element={<JoinRoom />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
