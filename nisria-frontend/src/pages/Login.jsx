// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getDashboardRoute } from '../constants/roles';
import ThemeToggle from '../components/ui/ThemeToggle'; // Optional: if you want to place it here


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
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const orb4Ref = useRef(null);

  // Get the redirect path
  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    // Animate floating orbs
    const animateOrbs = () => {
      const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current, orb4Ref.current];
      
      orbs.forEach((orb, index) => {
        if (orb) {
          const duration = 3000 + (index * 500);
          const delay = index * 200;
          
          const animate = () => {
            const time = Date.now();
            const x = Math.sin(time / duration) * 50;
            const y = Math.cos(time / (duration * 0.8)) * 30;
            const scale = 1 + Math.sin(time / duration) * 0.1;
            
            orb.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
          };
          
          setTimeout(() => {
            const interval = setInterval(animate, 16);
            return () => clearInterval(interval);
          }, delay);
        }
      });
    };

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

    animateOrbs();
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
    <div ref={containerRef} className="min-h-screen bg-s1 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center transition-colors duration-300">
      {/* Animated Background Orbs */}
      <div 
        ref={orb1Ref}
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-p1/30 to-p2/20 dark:from-p1/20 dark:to-p2/15 rounded-full"
        style={{ filter: 'blur(100px)' }}
      />
      <div 
        ref={orb2Ref}
        className="absolute top-10 right-32 w-80 h-80 bg-gradient-to-br from-p2/25 to-p5/15 dark:from-p2/20 dark:to-p5/10 rounded-full"
        style={{ filter: 'blur(120px)' }}
      />
      <div 
        ref={orb3Ref}
        className="absolute bottom-32 left-1/4 w-96 h-96 bg-gradient-to-br from-p1/20 to-s3/10 dark:from-p1/15 dark:to-s3/5 rounded-full"
        style={{ filter: 'blur(140px)' }}
      />
      <div 
        ref={orb4Ref}
        className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-p2/25 to-p1/15 dark:from-p2/20 dark:to-p1/10 rounded-full"
        style={{ filter: 'blur(110px)' }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-p5/20 dark:bg-p5/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Glassmorphism Login Form */}
      <div 
        ref={formRef}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div 
          className="rounded-3xl p-8 border relative overflow-hidden
                     bg-p4/10 dark:bg-slate-800/30 
                     border-p5/20 dark:border-slate-700/50
                     backdrop-blur-xl" // Assuming backdrop-blur-xl (24px) is acceptable, or define 'blur(20px)' in tailwind.config.js
          style={{
            // background and border are now handled by Tailwind classes above for theming.
            // backdropFilter: 'blur(20px)', // If 'blur(20px)' is critical and not covered by backdrop-blur-xl, make this dynamic or add to config.
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' // This custom shadow will not theme unless made dynamic or configured in Tailwind.
            // For dark mode, you might want: boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-p4/5 to-transparent dark:from-slate-700/10 rounded-3xl"
            style={{ pointerEvents: 'none' }}
          />

          {/* Logo and Title */}
          <div className="text-center mb-8 relative z-10">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-p4/10 dark:bg-slate-700/20 backdrop-blur-sm border border-p5/20 dark:border-slate-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-p1/20 to-p2/20 dark:from-p1/15 dark:to-p2/15 rounded-full" />
              <div className="relative size-20 rounded-full flex items-center justify-center z-10 mx-auto">
                <img
                  src="logo/compass-logo.png" 
                  alt="Logo"
                  className="pt-1 w-full h-full object-contain rounded-full flex items-center justify-center mx-auto" // Changed object-cover to object-contain for typical logos
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>
            </div>
            <h1 className="text-3xl font-light text-p4 dark:text-slate-100 mb-2 tracking-wide">Compass</h1>
            <p className="text-p5/80 dark:text-slate-400 text-sm">Welcome back!</p>
          </div>
          {/* Optional: <ThemeToggle /> */}
          {/* Login Form */}
          <div className="space-y-6 relative z-10">
            {error && (
              <div className="p-3 rounded-lg bg-p1/20 dark:bg-red-500/20 border border-p1/30 dark:border-red-500/30 text-p4 dark:text-red-100 text-sm flex items-center space-x-2 backdrop-blur-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
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
                           bg-p4/10 dark:bg-slate-700/50 backdrop-blur-sm 
                           border border-p5/20 dark:border-slate-600
                           text-p4 dark:text-slate-100 placeholder-p5/50 dark:placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-p2/50 dark:focus:ring-p2/70 focus:border-p2/50 dark:focus:border-p2/70
                           hover:bg-p4/15 dark:hover:bg-slate-700/70 hover:border-p5/30 dark:hover:border-slate-500"
                style={{
                  // background and backdropFilter should ideally be handled by Tailwind classes for theming
                  // If 'blur(10px)' is specific, add to tailwind.config.js or make this style object dynamic
                  backdropFilter: 'blur(10px)' // This will not theme unless made dynamic
                }}
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
                           bg-p4/10 dark:bg-slate-700/50 backdrop-blur-sm 
                           border border-p5/20 dark:border-slate-600
                           text-p4 dark:text-slate-100 placeholder-p5/50 dark:placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-p2/50 dark:focus:ring-p2/70 focus:border-p2/50 dark:focus:border-p2/70
                           hover:bg-p4/15 dark:hover:bg-slate-700/70 hover:border-p5/30 dark:hover:border-slate-500"
                style={{
                  backdropFilter: 'blur(10px)' // This will not theme unless made dynamic
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-p5/60 dark:text-slate-400 hover:text-p4/80 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-p4/10 dark:hover:bg-slate-700/30"
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
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 transition-all duration-200 
                                 ${rememberMe ? 'bg-p2 border-p2 dark:bg-p2-dark dark:border-p2-dark' : 'bg-p4/5 dark:bg-slate-700 border-p5/30 dark:border-slate-600'} 
                                 group-hover:border-p5/50 dark:group-hover:border-slate-500`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white dark:text-slate-900 absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-p5/70 dark:text-slate-400 text-sm group-hover:text-p4/80 dark:group-hover:text-slate-200 transition-colors">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg
                         bg-gradient-to-r from-p1 to-p2 dark:from-p1-dark dark:to-p2-dark 
                         hover:from-p1/90 hover:to-p2/90 dark:hover:from-p1-dark/90 dark:hover:to-p2-dark/90
                         focus:outline-none focus:ring-2 focus:ring-p2/50 dark:focus:ring-p2-dark/50
                         hover:shadow-p2/25 dark:hover:shadow-p2-dark/25"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Log In</span>
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-p5/60 dark:text-slate-400 text-sm">
                Forgot Password?{' '}
                <button
                  type="button"
                  className="text-p2 dark:text-p2-light hover:text-p2/80 dark:hover:text-p2-light/80 transition-colors font-medium hover:underline"
                >
                  Reset Password
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border border-p5/20 dark:border-slate-700 rounded-full bg-p4/5 dark:bg-slate-800/30 backdrop-blur-sm animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 border border-p5/20 dark:border-slate-700 rounded-full bg-p4/5 dark:bg-slate-800/30 backdrop-blur-sm animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 -left-8 w-4 h-4 border border-p5/20 dark:border-slate-700 rounded-full bg-p4/5 dark:bg-slate-800/30 backdrop-blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/4 -right-6 w-5 h-5 border border-p5/20 dark:border-slate-700 rounded-full bg-p4/5 dark:bg-slate-800/30 backdrop-blur-sm animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};

export default Login;