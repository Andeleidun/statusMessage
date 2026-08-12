import { useEffect, useState } from 'react';

export const ScreenReaderStatusMessage = ({ message, sequence = 0 }) => {
  const [announcement, setAnnouncement] = useState(null);
  const announcedMessage =
    announcement?.message === message && announcement.sequence === sequence
      ? announcement.message
      : '';

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setAnnouncement({ message, sequence });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [message, sequence]);

  return (
    <span role="status" aria-atomic="true" className="visually-hidden">
      {announcedMessage}
    </span>
  );
};
