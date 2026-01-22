import React, { useState, useEffect } from 'react';

const ScreenSizeCheck = ({ children }) => {
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // iPad Air width is 820px in portrait mode
      setIsScreenTooSmall(window.innerWidth < 820);
    };

    // Check on initial render
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isScreenTooSmall) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center p-6 text-center z-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Screen Size Not Supported
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This platform works best on tablets (iPad Air or larger) and laptops/desktops.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Please switch to a larger screen to continue.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ScreenSizeCheck;
