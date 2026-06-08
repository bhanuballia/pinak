import { useEffect } from 'react';
import { WINDOW_SEQUENCE } from '../utils/windowSequence';

export const useWindowNavigation = () => {
  useEffect(() => {
    // 1. Identify which window this is by window.name
    const currentName = window.name;
    const currentMatch = currentName.match(/^AstroWindow_(\d+)$/);
    let currentIndex = -1;

    if (currentMatch) {
      currentIndex = parseInt(currentMatch[1], 10);
      document.title = `${currentIndex}. ${WINDOW_SEQUENCE[currentIndex - 1]?.label || 'Astro Window'}`;
    }

    // Register this window as open
    if (currentIndex > 0) {
      const openWindowsStr = localStorage.getItem('astro_open_windows') || '[]';
      try {
        let openWindows = JSON.parse(openWindowsStr);
        if (!openWindows.includes(currentIndex)) {
          openWindows.push(currentIndex);
          openWindows.sort((a, b) => a - b);
          localStorage.setItem('astro_open_windows', JSON.stringify(openWindows));
        }
      } catch (e) {}
    }

    const handleBeforeUnload = () => {
      if (currentIndex > 0) {
        const openWindowsStr = localStorage.getItem('astro_open_windows') || '[]';
        try {
          let openWindows = JSON.parse(openWindowsStr);
          openWindows = openWindows.filter(id => id !== currentIndex);
          localStorage.setItem('astro_open_windows', JSON.stringify(openWindows));
        } catch (e) {}
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Keyboard navigation
    const handleKeyDown = (e) => {
      // If user is focused on an input, don't trigger window nav
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        let openWindows = [];
        try {
          openWindows = JSON.parse(localStorage.getItem('astro_open_windows') || '[]');
        } catch(e) {}
        
        if (openWindows.length === 0) return; // Nothing to cycle to

        // If on the main window, we need to pick a starting point
        let currentCycleIndex = -1;
        if (currentIndex === -1) {
            const lastStr = localStorage.getItem('astro_active_index');
            const lastActive = lastStr ? parseInt(lastStr, 10) : openWindows[0];
            // Find closest index in openWindows
            currentCycleIndex = openWindows.indexOf(lastActive);
            if (currentCycleIndex === -1) currentCycleIndex = 0; // Default to first open window
        } else {
            currentCycleIndex = openWindows.indexOf(currentIndex);
            if (currentCycleIndex === -1) currentCycleIndex = 0;
        }

        let nextCycleIndex;
        if (e.key === 'ArrowDown') {
          nextCycleIndex = currentCycleIndex + 1;
          if (nextCycleIndex >= openWindows.length) nextCycleIndex = 0;
        } else {
          nextCycleIndex = currentCycleIndex - 1;
          if (nextCycleIndex < 0) nextCycleIndex = openWindows.length - 1;
        }

        const nextIndex = openWindows[nextCycleIndex];
        const nextWinConfig = WINDOW_SEQUENCE[nextIndex - 1];
        
        if (nextWinConfig) {
          localStorage.setItem('astro_active_index', nextIndex.toString());
          openAstroWindow(nextWinConfig);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export const openAstroWindow = (winConfig, globalData = null) => {
  const windowParams = 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no';
  
  if (globalData) {
    localStorage.setItem('worksheetData', JSON.stringify(globalData));
  }
  
  let finalUrl = '';
  if (winConfig.type === 'custom') {
    finalUrl = winConfig.url;
  } else if (winConfig.type === 'worksheet') {
    finalUrl = `/?worksheet=true&fullScreen=${winConfig.id}`;
  } else if (winConfig.type === 'oracle') {
    const params = new URLSearchParams({ lang: 'hindi' });
    const dataStr = localStorage.getItem('worksheetData');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        const basic = data?.basic_details || {};
        const meta = data?.meta || {};
        params.set('name', meta.name || basic.name || '');
        params.set('date', basic.birth_date || '');
        params.set('time', basic.birth_time || '');
        params.set('lat', basic.lat || '');
        params.set('lon', basic.lon || '');
        params.set('tz', basic.tz_offset || '0');
      } catch (e) {}
    }
    
    if (winConfig.id === 'lalkitab') params.set('lalkitab', 'true');
    else if (winConfig.id === 'daily_panchang') params.set('panchang', 'true');
    else if (winConfig.id === 'horary') params.set('horary', 'true');
    else if (winConfig.id === 'chakra') params.set('chakra', 'true');
    else if (winConfig.id === 'yantra') params.set('yantra', 'true');
    else params.set(winConfig.id, 'true');

    finalUrl = `/?${params.toString()}`;
  }

  if (finalUrl) {
    window.open(finalUrl, winConfig.name, windowParams).focus();
  }
};
