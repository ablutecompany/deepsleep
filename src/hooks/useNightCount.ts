import { useState, useEffect } from 'react';

export function useNightCount() {
  const [nightCount, setNightCount] = useState(() => {
    return parseInt(localStorage.getItem('nightCount') || '0', 10);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setNightCount(parseInt(localStorage.getItem('nightCount') || '0', 10));
    };

    window.addEventListener('deepsleep_simulated_change', handleUpdate);
    window.addEventListener('deepsleep_baseline_invalidated', handleUpdate);
    return () => {
      window.removeEventListener('deepsleep_simulated_change', handleUpdate);
      window.removeEventListener('deepsleep_baseline_invalidated', handleUpdate);
    };
  }, []);

  return nightCount;
}
