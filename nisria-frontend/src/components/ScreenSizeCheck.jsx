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
        className="fixed inset-0 flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <motion.div
          className="relative z-10 backdrop-blur-sm bg-white/10 border border-white/30 rounded-3xl p-10 flex flex-col items-center shadow-xl max-w-md mx-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {/* Logo */}
          <motion.img
            src={logo}
            alt="Dira Logo"
            className="w-28 h-28 mb-6"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Device Not Supported
          </h2>

          {/* Description */}
          <p className="text-white/80 mb-4">
            {isTabletDevice
              ? 'Please rotate your device to landscape mode for the best experience.'
              : 'This platform requires a tablet (iPad Mini or larger) or desktop computer.'}
          </p>
          <p className="text-white/60 text-sm">
            {isTabletDevice
              ? 'For the best experience, we recommend using landscape orientation.'
              : 'Please switch to a supported device to continue.'}
          </p>

          {/* Button for rotated tablets */}
          {isTabletDevice && (
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 px-6 py-3 rounded-xl text-black bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              I've Rotated My Device
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ScreenSizeCheck;
