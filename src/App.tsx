import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Room from './components/Room'
import JoinRoom from './components/JoinRoom'
import githubMark from './assets/github-mark.png'
import ThemeToggle from './components/ThemeToggle'
import './App.css'
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ThemeToggle />
        <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Planning Poker</h1>
            <a
              href="https://github.com/k88manish/poker-planning"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed top-4 right-4 z-50 transition-opacity duration-300 hover:opacity-70"
              aria-label="View source on GitHub"
            >
              <img
                src={githubMark}
                alt="GitHub"
                className="w-8 h-8"
              />
            </a>
          </div>
        </header>
        <main className="flex-grow transition-colors duration-300
          bg-gradient-to-br from-purple-600 to-blue-500
          dark:bg-gray-900 dark:bg-none"
        >
          <div className="container mx-auto px-4 max-w-7xl ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/join/:roomId" element={<JoinRoom />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
