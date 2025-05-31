import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Use <a href="/login"> if not using React Router
import bgImage from '/bg.jpg';
import logo from '/logo/Compass.png';

const CompassLanding = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard/compass/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div
      className="overflow-hidden min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Big Compass logo behind the card */}
      <motion.img
        src={logo}
        alt="Compass Logo Background"
        className="w-72 h-72 absolute top-14 left-1/2 -translate-x-1/2 z-0 opacity-80"
      />

      {/* Card in front */}
      <motion.div
        className="relative z-10 backdrop-blur-sm bg-white/10 border border-white/30 rounded-3xl p-10 flex flex-col items-center shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <motion.img
          src={logo}
          alt="Compass Logo"
          className="w-32 h-32 translate-x-2"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        <motion.h2
          className="mx-50 text-2xl md:text-2xl lg:text-3xl font-normal text-black text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
        >
        <span className="text-red-500">C</span>ompass.<br />
        What do you Seek<span className="text-red-500">?</span>
      </motion.h2>
      </motion.div>

      {/* Button - below the card */}
        <motion.div
          className="mt-10 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.5, ease: 'easeOut' }}
        >

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl text-black bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-blue-300/30 cursor-pointer transition-all duration-500 ease-in-out shadow-md hover:shadow-lg"
            >
              Go to Login
            </motion.button>
          </Link>
        </motion.div>
    </div>
  );
};

export default CompassLanding;
