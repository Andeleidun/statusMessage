import React, { useEffect, useState } from 'react';

export const ScreenReaderStatusMessage = ({ message }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!showMessage && message) {
      setShowMessage(true);
    }
  }, [message, showMessage]);
  return (
    <span role="status" className="hidden">
      {showMessage && message}
    </span>
  );
};
