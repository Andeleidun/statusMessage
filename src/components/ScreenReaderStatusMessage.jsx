import React, { useEffect, useState } from 'react';

export const ScreenReaderStatusMessage = ({ message, sequence = 0 }) => {
  const [announcedMessage, setAnnouncedMessage] = useState(null);

  useEffect(() => {
    setAnnouncedMessage(null);

    if (!message) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage(() => message);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [message, sequence]);

  return (
    <span role="status" aria-atomic="true" className="visually-hidden">
      {announcedMessage}
    </span>
  );
};
