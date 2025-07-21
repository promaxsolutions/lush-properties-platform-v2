import React from "react";

interface CompactWrapperProps {
  children: React.ReactNode;
}

const CompactWrapper: React.FC<CompactWrapperProps> = ({ children }) => {
  // Simple mobile detection using window width
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className={`min-h-screen ${isMobile ? "bg-white p-2" : "bg-gray-50 p-6"}`}>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#f9f9f9] shadow-md p-3 text-center z-50">
          <p className="text-xs text-gray-500">📱 Mobile View Active — simplified layout</p>
        </div>
      )}
      <main className={`${isMobile ? "text-sm pb-16" : "text-base"}`}>
        {children}
      </main>
    </div>
  );
};

export default CompactWrapper;