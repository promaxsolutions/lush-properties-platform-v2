import React, { useEffect } from "react";

interface MobileEnhancerProps {
  children: React.ReactNode;
}

const MobileEnhancer: React.FC<MobileEnhancerProps> = ({ children }) => {
  // PWA Install Prompt Handler
  useEffect(() => {
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      const installBtn = document.getElementById("pwa-install");
      if (installBtn) {
        installBtn.style.display = "block";
        installBtn.onclick = async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
              console.log('PWA installed successfully');
            }
            deferredPrompt = null;
            installBtn.style.display = "none";
          }
        };
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Swipeable Cards Setup
  useEffect(() => {
    const container = document.getElementById("swipe-cards");
    if (container) {
      container.style.overflowX = "scroll";
      container.style.display = "flex";
      container.style.gap = "1rem";
      container.style.scrollSnapType = "x mandatory";
      
      // Add smooth scrolling behavior
      const cards = container.children;
      Array.from(cards).forEach((card: any) => {
        card.style.scrollSnapAlign = "start";
        card.style.flexShrink = "0";
      });
    }
  }, []);

  // Mobile-optimized touch gestures
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next card
          console.log('Swiped left');
        } else {
          // Swipe right - previous card
          console.log('Swiped right');
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PWA Install Button */}
      <button 
        id="pwa-install" 
        style={{ display: "none" }} 
        className="fixed top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 transition-colors"
      >
        📲 Install App
      </button>

      {/* Mobile Status Bar */}
      <div className="bg-blue-600 text-white p-2 text-center text-sm md:hidden">
        🌍 Lush Properties Control Center • Swipe cards horizontally
      </div>

      {/* Swipeable Project Cards */}
      <section id="swipe-cards" className="p-4 md:hidden">
        <div className="min-w-[280px] bg-white rounded-lg shadow-md p-4 border">
          <h3 className="font-bold text-gray-900 mb-2">📋 Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-100 text-blue-800 p-2 rounded text-sm">Upload Receipt</button>
            <button className="w-full bg-green-100 text-green-800 p-2 rounded text-sm">View Progress</button>
          </div>
        </div>
        
        <div className="min-w-[280px] bg-white rounded-lg shadow-md p-4 border">
          <h3 className="font-bold text-gray-900 mb-2">💰 Financial Summary</h3>
          <div className="text-sm text-gray-600">
            <p>Budget: $850,000</p>
            <p>Spent: $642,000</p>
            <p>Remaining: $208,000</p>
          </div>
        </div>
        
        <div className="min-w-[280px] bg-white rounded-lg shadow-md p-4 border">
          <h3 className="font-bold text-gray-900 mb-2">🏗️ Project Status</h3>
          <div className="text-sm text-gray-600">
            <p>Stage: Construction</p>
            <p>Progress: 75%</p>
            <p>Next: Inspection</p>
          </div>
        </div>
      </section>

      {/* Mobile Camera Upload */}
      <div className="p-4 md:hidden">
        <div className="bg-white rounded-lg shadow-md p-4 border">
          <label className="text-sm font-semibold block mb-3 text-gray-900">📸 Camera Upload</label>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                console.log('File selected:', e.target.files[0].name);
                // Handle file upload
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-2">
            Tap to use camera for receipts, progress photos, or documents
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4">
        {children}
      </main>

      {/* Mobile Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-40">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <span className="text-lg">📊</span>
            <span className="text-xs">Reports</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <span className="text-lg">📷</span>
            <span className="text-xs">Upload</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <span className="text-lg">⚙️</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {/* PWA Features Detection */}
      <div className="hidden md:block p-4 bg-blue-50 border border-blue-200 rounded-lg m-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Mobile Features:</strong> Install this app on your phone for camera access, offline mode, and push notifications.
        </p>
      </div>
    </div>
  );
};

export default MobileEnhancer;