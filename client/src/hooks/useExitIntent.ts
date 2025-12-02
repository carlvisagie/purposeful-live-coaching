import { useEffect, useState } from 'react';

/**
 * Exit-intent detection hook
 * Triggers when user moves mouse toward top of viewport (to close tab/window)
 * Only triggers once per session using localStorage
 */
export function useExitIntent(enabled: boolean = true) {
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Check if already shown in this session
    const hasShown = sessionStorage.getItem('exitIntentShown');
    if (hasShown) return;

    let hasMovedAway = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves to top of viewport (toward browser chrome)
      if (e.clientY <= 10 && !hasMovedAway) {
        hasMovedAway = true;
        setShowExitIntent(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Add listener after short delay to avoid false triggers
    const timeoutId = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  const dismissExitIntent = () => {
    setShowExitIntent(false);
  };

  return { showExitIntent, dismissExitIntent };
}
