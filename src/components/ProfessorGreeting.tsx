'use client';

import React, { useState, useEffect } from 'react';

// Function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Function to reset the popup state (for testing)
export const resetProfessorGreeting = () => {
  if (typeof window !== 'undefined') {
    safeLocalStorage.removeItem('professorGreetingShown');
    console.log('Professor greeting reset - will show on next page load');
  }
};

const ProfessorGreeting = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentView, setCurrentView] = useState('greeting');
  const [isAnimating, setIsAnimating] = useState(false);

  // Show popup with delay when component mounts, but only if not shown before
  useEffect(() => {
    // Check if popup has been shown before
    const hasShownPopup = safeLocalStorage.getItem('professorGreetingShown');
    
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark as shown in localStorage
        safeLocalStorage.setItem('professorGreetingShown', 'true');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle view transitions with animation
  const handleViewTransition = (nextView: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView(nextView);
      setIsAnimating(false);
    }, 300);
  };

  // Close the popup
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] animate-fadeIn">
      <div className="bg-[#0D0D0D] border-2 border-[#00FF41] rounded-lg p-8 max-w-md w-full shadow-[0_0_20px_rgba(0,255,65,0.5)] animate-scaleIn">
        <div className="overflow-hidden relative">
          {/* First View: Greeting */}
          <div 
            className={`transition-all duration-300 transform ${
              isAnimating && currentView !== 'greeting' ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            } ${currentView !== 'greeting' ? 'absolute inset-0 pointer-events-none' : ''}`}
          >
            {currentView === 'greeting' && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-8 text-[#00FF41]">Hi Arno!</h2>
                <div className="flex flex-col space-y-4">
                  <button
                    type="button"
                    onClick={() => handleViewTransition('message')}
                    className="bg-[#00FF41] text-[#0D0D0D] font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-300 min-h-[60px] cursor-pointer"
                  >
                    What do you want to tell me
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-[#1A1A1A] text-[#00FF41] border border-[#00FF41] font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-300 min-h-[60px] cursor-pointer"
                  >
                    Fuck off let me review
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Second View: Message */}
          <div 
            className={`transition-all duration-300 transform ${
              isAnimating && (currentView === 'greeting' || currentView === 'final') 
                ? currentView === 'greeting' 
                  ? 'translate-x-full opacity-0' 
                  : '-translate-x-full opacity-0'
                : 'translate-x-0 opacity-100'
            } ${currentView !== 'message' ? 'absolute inset-0 pointer-events-none' : ''}`}
          >
            {currentView === 'message' && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-8 text-[#00FF41]">
                  For me to get the most out of this, I need you to be brutal. Try every little thing and give me feedback. <br /> I'll be in the live taking notes
                </h2>
                <button
                  type="button"
                  onClick={() => handleViewTransition('final')}
                  className="bg-[#00FF41] text-[#0D0D0D] font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-300 min-h-[60px] w-full cursor-pointer"
                >
                  Alright I'll try
                </button>
              </div>
            )}
          </div>

          {/* Third View: Final Message */}
          <div 
            className={`transition-all duration-300 transform ${
              isAnimating && currentView === 'message' ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            } ${currentView !== 'final' ? 'absolute inset-0 pointer-events-none' : ''}`}
          >
            {currentView === 'final' && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-8 text-[#00FF41]">
                  Did you know Business Mastery is the best campus in TRW?
                </h2>
                <div className="flex flex-col space-y-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-[#00FF41] text-[#0D0D0D] font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-300 min-h-[60px] cursor-pointer"
                  >
                    I agree
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-[#1A1A1A] text-[#00FF41] border border-[#00FF41] font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-300 min-h-[60px] cursor-pointer"
                  >
                    I'm gay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorGreeting; 