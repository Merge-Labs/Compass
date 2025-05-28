// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle'; // Import the ThemeToggle component
import { useTheme } from '../context/ThemeProvider'; // Import useTheme to access the current theme

const Landing = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      theme === 'light' ? 'bg-s1 text-p4' : 'bg-slate-900 text-slate-100'
    }`}>
      <header className="absolute top-0 right-0 p-4 md:p-6">
        <ThemeToggle />
      </header>

      <main className="text-center p-6">
        <img 
          src="/logo/compass-logo.png" 
          alt="Compass Logo" 
          className={`w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 transition-opacity duration-500 ${
            theme === 'dark' ? 'opacity-90' : 'opacity-100'
          }`} 
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-p1 dark:text-p1-light">Compass</span>
        </h1>
        <p className={`text-lg md:text-xl mb-8 ${theme === 'light' ? 'text-p5/80' : 'text-slate-400'}`}>
          Navigate your world with precision and ease.
        </p>
        <Link
          to="/login"
          className="px-8 py-3 bg-p2 hover:bg-p2/90 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 dark:bg-p2-dark dark:hover:bg-p2-dark/90"
        >
          Get Started
        </Link>
      </main>

      <footer className={`absolute bottom-0 p-4 text-sm ${theme === 'light' ? 'text-p5/70' : 'text-slate-500'}`}>
        © {new Date().getFullYear()} Nisria. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;