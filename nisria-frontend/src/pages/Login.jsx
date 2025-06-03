// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle, DoorOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getDashboardRoute } from '../constants/roles';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import bgImage from '/bg.jpg';
import logo from '/logo/Compass.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const containerRef = useRef(null);
  const formRef = useRef(null);

  // Get the redirect path
  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    // Form entrance animation
    if (formRef.current) {
      formRef.current.style.opacity = '0';
      formRef.current.style.transform = 'translateY(30px) scale(0.95)';
      
      setTimeout(() => {
        formRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        formRef.current.style.opacity = '1';
        formRef.current.style.transform = 'translateY(0) scale(1)';
      }, 100);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Get user role and redirect to appropriate dashboard
        const user = JSON.parse(localStorage.getItem('user'));
        const dashboardRoute = getDashboardRoute(user?.role);
        navigate(from || dashboardRoute, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
        console.error(error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative overflow-hidden transition-colors duration-300"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundColor: 'var(--fallback-bg, #f8fafc)' // Fallback if image doesn't load
      }}
    >
      {/* Dark mode overlay */}
      <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300" />

      
      {/* Login Form Card */}
      <motion.div 
        ref={formRef}
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div className="backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-3xl p-10 shadow-xl">
          {/* Logo and Title Section */}
          <div className="text-center mb-8">
            <motion.img
              src={logo}
              alt="Compass Logo"
              className="w-32 h-32 mx-auto mb-4"
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            
            <motion.h1
              className="text-2xl md:text-3xl font-normal text-black dark:text-white text-center mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            >
              <span className="text-red-500">C</span>ompass
            </motion.h1>
            
            <motion.p
              className="text-black/70 dark:text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            >
              Welcome back!
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-300 text-sm flex items-center space-x-2 backdrop-blur-sm"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Username or Email"
                required
                className="w-full px-4 py-3 rounded-xl transition-all duration-300
                           bg-white/10 dark:bg-black/20 backdrop-blur-sm 
                           border border-white/20 dark:border-white/15
                           text-black dark:text-white placeholder-black/50 dark:placeholder-white/50
                           focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
                           hover:bg-white/15 dark:hover:bg-black/30 hover:border-white/30 dark:hover:border-white/25"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl transition-all duration-300
                           bg-white/10 dark:bg-black/20 backdrop-blur-sm 
                           border border-white/20 dark:border-white/15
                           text-black dark:text-white placeholder-black/50 dark:placeholder-white/50
                           focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
                           hover:bg-white/15 dark:hover:bg-black/30 hover:border-white/30 dark:hover:border-white/25"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors p-1 rounded-md hover:bg-white/10 dark:hover:bg-black/20"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className=" border-black sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 transition-all duration-200 
                                 ${rememberMe 
                                   ? 'bg-red-500 border-red-500 dark:bg-red-500 dark:border-red-500' 
                                   : 'bg-white/10 dark:bg-black/20 border-black/30 dark:border-white/20'
                                 } 
                                 group-hover:border-black/50 dark:group-hover:border-white/30`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-black/70 dark:text-white/70 text-sm group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg
                         bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700
                         hover:from-red-400 hover:to-red-500 dark:hover:from-red-500 dark:hover:to-red-600
                         focus:outline-none focus:ring-2 focus:ring-red-500/50
                         backdrop-blur-sm border border-red-500/20 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Log In</span>
                </>
              )}
            </motion.button>

            {/* Forgot Password Link */}
            <div className="text-center space-y-2">
              <span className="text-black/60 dark:text-white/60 text-sm">
                Forgot Password?{' '}
                <button
                  type="button"
                  className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors font-medium hover:underline"
                >
                  Reset Password
                </button>
              </span>
              
              {/* Funny message for unauthorized users */}
              <div className="flex items-center justify-center space-x-2 text-black/50 dark:text-white/50 text-xs">
                <DoorOpen size={14} />
                <span>Don't have an account? Please leave! 🚪</span>
              </div>
              <p className="text-black/40 dark:text-white/40 text-xs italic">
                (Only Super Admin can create accounts)
              </p>
            </div>
          </motion.div>
        </div>

        {/* Decorative floating elements - matching landing page style */}
        <motion.div 
          className="absolute -top-4 -left-4 w-8 h-8 border border-white/20 dark:border-white/15 rounded-full bg-white/5 dark:bg-black/10 backdrop-blur-sm"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-4 -right-4 w-6 h-6 border border-white/20 dark:border-white/15 rounded-full bg-white/5 dark:bg-black/10 backdrop-blur-sm"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div 
          className="absolute top-1/2 -left-8 w-4 h-4 border border-white/20 dark:border-white/15 rounded-full bg-white/5 dark:bg-black/10 backdrop-blur-sm"
          animate={{ 
            x: [-5, 5, -5],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/4 -right-6 w-5 h-5 border border-white/20 dark:border-white/15 rounded-full bg-white/5 dark:bg-black/10 backdrop-blur-sm"
          animate={{ 
            x: [5, -5, 5],
            y: [0, -8, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </motion.div>
    </div>
  );
};

export default Login;