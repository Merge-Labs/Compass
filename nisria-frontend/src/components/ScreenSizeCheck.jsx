import React, { useState, useEffect } from 'react';

// Device detection helper
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if device is an iPad
const isIPad = () => {
  return /iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document;
};

// Check if screen is too small
const isScreenTooSmall = () => {
  const isPortrait = window.innerHeight > window.innerWidth;
  // For iPad in landscape, we want to allow the full width
  if (isIPad() && !isPortrait) {
    return window.innerWidth < 1024;
  }
  // For other devices or portrait mode
  return window.innerWidth < 768;
};

// Check if device is a tablet
const isTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroidTablet = /(android(?!.*mobile))/.test(userAgent);
  return isIPad() || isAndroidTablet || (!isMobileDevice() && window.innerWidth >= 768);
};

// Check if we're in landscape mode on a tablet
const isTabletLandscape = () => {
  return isTablet() && window.innerWidth > window.innerHeight && window.innerWidth >= 1024;
};

const ScreenSizeCheck = ({ children }) => {
  const [showUnsupportedScreen, setShowUnsupportedScreen] = useState(false);
  const [isTabletDevice, setIsTabletDevice] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkDeviceAndScreen = () => {
      const tooSmall = isScreenTooSmall();
      const isTabletDevice = isTablet();
      const isLandscapeMode = isTabletLandscape();
      
      // For iPad in landscape, we want to allow the full width
      if (isLandscapeMode) {
        document.documentElement.classList.add('tablet-landscape');
        document.documentElement.classList.remove('portrait');
        setIsLandscape(true);
      } else {
        document.documentElement.classList.remove('tablet-landscape');
        document.documentElement.classList.add('portrait');
        setIsLandscape(false);
      }
      
      // Show unsupported screen if:
      // 1. It's a mobile device (phones), or
      // 2. Screen is too small (smaller than iPad Mini)
      setShowUnsupportedScreen((isMobileDevice() && !isTabletDevice) || tooSmall);
      setIsTabletDevice(isTabletDevice);

      // Add a class to the HTML element for responsive adjustments
      if (isTabletDevice) {
        document.documentElement.classList.add('is-tablet');
        
        // Add orientation class
        if (window.innerWidth > window.innerHeight) {
          document.documentElement.classList.add('landscape');
          document.documentElement.classList.remove('portrait');
        } else {
          document.documentElement.classList.add('portrait');
          document.documentElement.classList.remove('landscape');
        }
      } else {
        document.documentElement.classList.remove('is-tablet', 'landscape', 'portrait');
      }
    };

    // Initial check
    checkDeviceAndScreen();

    // Add event listeners
    window.addEventListener('resize', checkDeviceAndScreen);
    window.addEventListener('orientationchange', checkDeviceAndScreen);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkDeviceAndScreen);
      window.removeEventListener('orientationchange', checkDeviceAndScreen);
      document.documentElement.classList.remove('is-tablet', 'tablet-landscape', 'landscape', 'portrait');
    };
  }, []);

  if (showUnsupportedScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center p-6 text-center z-[9999] select-none">
        <div className="max-w-md mx-auto p-8 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto mb-6 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Device Not Supported
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {isTabletDevice 
              ? 'Please rotate your device to landscape mode for the best experience.'
              : 'This platform requires a tablet (iPad Mini or larger) or desktop computer.'
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isTabletDevice 
              ? 'For the best experience, we recommend using landscape orientation.'
             : 'Please switch to a supported device to continue.'
            }
          </p>
          
          {isTabletDevice && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              I've Rotated My Device
            </button>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default ScreenSizeCheck;
