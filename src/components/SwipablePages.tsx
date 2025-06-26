import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SwipeablePages = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef(null);

  // Sample pages data - you can replace with your own content
  const pages = [
    {
      id: 1,
      title: "Welcome",
      content: "Experience full-screen swipe navigation with smooth animations and intuitive gestures.",
      bgColor: "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"
    },
    {
      id: 2,
      title: "Features",
      content: "Discover powerful features designed for modern mobile experiences and desktop interaction.",
      bgColor: "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800"
    },
    {
      id: 3,
      title: "Settings",
      content: "Configure your preferences with an immersive full-screen interface that adapts to your needs.",
      bgColor: "bg-gradient-to-br from-orange-600 via-red-600 to-pink-800"
    },
    {
      id: 4,
      title: "Profile",
      content: "Manage your profile in a beautiful, distraction-free environment optimized for focus.",
      bgColor: "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800"
    }
  ];

  const handleStart = (clientX: any) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: any) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    const maxTranslate = 100; // Maximum translate distance
    const clampedDiff = Math.max(-maxTranslate, Math.min(maxTranslate, diff));
    setTranslateX(clampedDiff);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const threshold = 50; // Minimum swipe distance to trigger page change

    if (translateX > threshold && currentPage > 0) {
      // Swipe right - go to previous page
      setCurrentPage(prev => prev - 1);
    } else if (translateX < -threshold && currentPage < pages.length - 1) {
      // Swipe left - go to next page
      setCurrentPage(prev => prev + 1);
    }

    setTranslateX(0);
  };

  // Touch events
  const handleTouchStart = (e: any) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events (for desktop testing)
  const handleMouseDown = (e: any) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: any) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Navigation functions
  const goToPage = (index: any) => {
    setCurrentPage(index);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    const handleGlobalMouseMove = (e: any) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Floating header with page indicators */}
      <div className="absolute top-0 left-0 right-0 z-10  from-black/50 to-transparent p-6 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Swipe Demo</h2>
          <span className="text-sm text-white/80 bg-black/30 px-3 py-1 rounded-full">
            {currentPage + 1} / {pages.length}
          </span>
        </div>

        {/* Page dots indicator */}
        <div className="flex justify-center space-x-3">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPage
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${currentPage * 100}% + ${translateX}px))`,
            transitionDuration: isDragging ? '0ms' : '300ms'
          }}
        >
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`min-w-full h-full flex flex-col justify-center items-center text-white px-8 ${page.bgColor}`}
            >
              <div className="max-w-lg text-center">
                <h3 className="text-4xl md:text-5xl font-bold mb-8">{page.title}</h3>
                <p className="text-xl md:text-2xl leading-relaxed opacity-90 mb-12">
                  {page.content}
                </p>

                {/* Page-specific content */}
                {index === 0 && (
                  <div className="flex items-center justify-center space-x-2 text-lg opacity-80">
                    <span>Swipe left to continue</span>
                    <span className="text-2xl">👈</span>
                  </div>
                )}
                {index === pages.length - 1 && (
                  <div className="flex items-center justify-center space-x-2 text-lg opacity-80">
                    <span className="text-2xl">👉</span>
                    <span>Swipe right to go back</span>
                  </div>
                )}
                {index > 0 && index < pages.length - 1 && (
                  <div className="flex items-center justify-center space-x-4 text-lg opacity-80">
                    <span className="text-2xl">👉</span>
                    <span>Swipe to navigate</span>
                    <span className="text-2xl">👈</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-20 text-white transition-opacity ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-20 text-white transition-opacity ${currentPage === pages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Footer with swipe hints */}
      <div className="bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-600">
          Swipe horizontally or use arrows to navigate
        </p>
        <div className="flex justify-center mt-2 space-x-4 text-xs text-gray-500">
          <span>Touch • Mouse • Keyboard</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeablePages;