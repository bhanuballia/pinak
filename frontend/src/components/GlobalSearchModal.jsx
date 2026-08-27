import React, { useState, useEffect, useRef } from 'react';
import { getSearchOptions } from '../utils/searchConfig';

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showError, setShowError] = useState("");
  const inputRef = useRef(null);
  
  const searchOptions = getSearchOptions((err) => {
    setShowError(err);
    setTimeout(() => setShowError(""), 3000);
  });

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearchQuery("");
      setShowError("");
    }
  }, [isOpen]);
  
  const filteredSearchOptions = searchQuery.trim()
    ? searchOptions.filter(opt => {
      const query = searchQuery.toLowerCase();
      return opt.label.toLowerCase().includes(query) || opt.keywords.some(k => k.toLowerCase().includes(query));
    })
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredSearchOptions.length > 0) {
      const selectedOption = filteredSearchOptions[0];
      selectedOption.action();
      setIsOpen(false);
    }
  };

  const handleOptionClick = (opt) => {
    opt.action();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-[0_4px_20px_rgba(79,70,229,0.5)] flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all z-[9998] group focus:outline-none focus:ring-4 focus:ring-indigo-300"
        title="Search Dashboard (Ctrl+K)"
      >
        <span className="text-2xl">🔍</span>
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Global Search (Ctrl+K)
        </span>
      </button>

      {/* Full-screen Spotlight Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools, charts, reports... (e.g., 'D1', 'Marriage')"
                className="w-full pl-12 pr-12 py-5 bg-transparent border-0 focus:ring-0 text-xl text-slate-800 placeholder-slate-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  ESC
                </span>
              </div>
            </form>

            {/* Error Message */}
            {showError && (
              <div className="px-4 py-3 bg-red-50 border-t border-red-100 text-red-600 text-sm font-medium">
                {showError}
              </div>
            )}

            {/* Search Results */}
            {searchQuery.trim() && (
              <div className="border-t border-gray-100 max-h-[60vh] overflow-y-auto">
                {filteredSearchOptions.length > 0 ? (
                  <div className="py-2">
                    {filteredSearchOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                          idx === 0 ? "bg-indigo-50/70 hover:bg-indigo-100" : "hover:bg-slate-50"
                        }`}
                        onClick={() => handleOptionClick(opt)}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${idx === 0 ? "text-indigo-600" : "text-slate-400"}`}>
                            {idx === 0 ? "↳" : "•"}
                          </span>
                          <span className={`font-semibold ${idx === 0 ? "text-indigo-900" : "text-slate-700"}`}>
                            {opt.label}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${idx === 0 ? "text-indigo-600" : "text-slate-400"}`}>
                          Open ↗
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <span className="text-4xl block mb-2 opacity-30">🔭</span>
                    <p className="text-gray-500 font-medium text-lg">No tools or charts found</p>
                    <p className="text-gray-400 text-sm mt-1">Try using different keywords like "Dasha", "Chart", or "Health"</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Default State (Empty Search) */}
            {!searchQuery.trim() && (
              <div className="border-t border-gray-100 px-6 py-8 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {["Lagna", "Navamsha", "Marriage", "Finance", "Sudarshan Chakra", "KP Chart"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
