import React, { useEffect, useState } from 'react';

// Utility to ensure applications can meet WCAG 2.1 AA SC 4.1.3 Status Messages
// Which can be found at: https://www.w3.org/WAI/WCAG21/Understanding/status-messages
export const ScreenReaderStatusMessage = ({ message }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!showMessage && message) {
      requestAnimationFrame(() => setShowMessage(true));
    }
  }, [message, showMessage]);
  return (
    <span role="status" className="hidden">
      {showMessage && message}
    </span>
  );
};
