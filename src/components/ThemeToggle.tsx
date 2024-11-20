import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-4 left-4 z-50 p-2 rounded-full bg-opacity-20 backdrop-blur-md
                 dark:bg-white dark:bg-opacity-10 bg-gray-800 bg-opacity-10
                 hover:bg-opacity-30 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FaSun className="w-6 h-6 text-yellow-400" />
      ) : (
        <FaMoon className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle; 