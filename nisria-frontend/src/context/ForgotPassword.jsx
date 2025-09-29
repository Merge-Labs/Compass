// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthProvider';
import { motion } from 'framer-motion';
import bgImage from '/bg.jpg';
import logo from '/logo/Compass.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { initiateGooglePasswordReset, isLoading } = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleTraditionalReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // Simulate API call for traditional password reset
      // In a real app, you'd call your backend API here:
      // await api.post('/api/auth/request-password-reset/', { email });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      console.error('Traditional password reset failed:', err);
      setError(err.response?.data?.detail || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const result = await initiateGooglePasswordReset(credentialResponse);
      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error || 'Google verification failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during Google verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google verification failed. Please try again.');
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative overflow-hidden transition-colors duration-300"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: 'var(--fallback-bg, #f8fafc)'
      }}
    >
      <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300" />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div className="backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-3xl p-10 shadow-xl">
          <div className="text-center mb-8">
            <motion.img
              src={logo}
              alt="Dira Logo"
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
              <span className="text-red-500">D</span>ira
            </motion.h1>
            <motion.p
              className="text-black/70 dark:text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            >
              Password Recovery
            </motion.p>
          </div>

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
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-300 text-sm flex items-center space-x-2 backdrop-blur-sm"
              >
                <Mail size={16} />
                <span>{message}</span>
              </motion.div>
            )}

            <form onSubmit={handleTraditionalReset} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-xl transition-all duration-300 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/15 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 hover:bg-white/15 dark:hover:bg-black/30 hover:border-white/30 dark:hover:border-white/25"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-400 hover:to-red-500 dark:hover:from-red-500 dark:hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 backdrop-blur-sm border border-red-500/20 cursor-pointer"
              >
                {isSubmitting || isLoading ? (
                  <Loader2 className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </motion.button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-400/50"></div>
              <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-400/50"></div>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false} // Set to false to show the button explicitly
              />
            </div>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;