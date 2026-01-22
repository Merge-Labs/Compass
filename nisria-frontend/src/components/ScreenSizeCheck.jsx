import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import bgImage from '/bg.jpg';
import logo from '/logo/Compass.png';

// Device detection helpers
const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isScreenTooSmall = () => {
  const isPortrait = window.innerHeight > window.innerWidth;
  const minWidth = isPortrait ? 768 : 1024;
  return window.innerWidth < minWidth;
};
const isTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIPad = /ipad|macintosh/i.test(userAgent) && 'ontouchend' in document;
  const isAndroidTablet = /(android(?!.*mobile))/.test(userAgent);
  return isIPad || isAndroidTablet || (!isMobileDevice() && window.innerWidth >= 768);
};

const ScreenSizeCheck = ({ children }) => {
  const [showUnsupportedScreen, setShowUnsupportedScreen] = useState(false);
  const [isTabletDevice, setIsTabletDevice] = useState(false);

  useEffect(() => {
    const checkDeviceAndScreen = () => {
      const tooSmall = isScreenTooSmall();
      const tablet = isTablet();

      setShowUnsupportedScreen((isMobileDevice() && !tablet) || tooSmall);
      setIsTabletDevice(tablet);

      if (tablet) {
        document.documentElement.classList.add('is-tablet');
      } else {
        document.documentElement.classList.remove('is-tablet');
      }
    };

    checkDeviceAndScreen();
    window.addEventListener('resize', checkDeviceAndScreen);

    return () => {
      window.removeEventListener('resize', checkDeviceAndScreen);
      document.documentElement.classList.remove('is-tablet');
    };
  }, []);

  if (showUnsupportedScreen) {
    return (
      <div
        className="overflow-hidden min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Big Compass logo behind the card */}
        <motion.img
          src={logo}
          alt="Dira Logo Background"
          className="w-72 h-72 absolute top-14 left-1/2 -translate-x-1/2 z-0 opacity-80"
        />

        {/* Card in front */}
        <motion.div
          className="relative z-10 backdrop-blur-sm bg-white/10 border border-white/30 rounded-3xl p-10 flex flex-col items-center shadow-xl max-w-md mx-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <motion.img
            src={logo}
            alt="Dira Logo"
            className="w-32 h-32 translate-x-2"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          <motion.h2
            className="text-2xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
          >
            Device Not Supported
          </motion.h2>

          <motion.p 
            className="text-white/80 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1.2, ease: 'easeOut' }}
          >
            {isTabletDevice
              ? 'Please rotate your device to landscape mode for the best experience.'
              : 'This platform requires a tablet (iPad Mini or larger) or desktop computer.'}
          </motion.p>
          
          <motion.p 
            className="text-white/60 text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1.2, ease: 'easeOut' }}
          >
            {isTabletDevice
              ? 'For the best experience, we recommend using landscape orientation.'
              : 'Please switch to a supported device to continue.'}
          </motion.p>

          {/* Button for rotated tablets */}
          {isTabletDevice && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
            >
              <motion.button
                onClick={() => window.location.reload()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl text-black bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-blue-300/30 cursor-pointer transition-all duration-500 ease-in-out shadow-md hover:shadow-lg"
              >
                I've Rotated My Device
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ScreenSizeCheck;
