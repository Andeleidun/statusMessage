import { useEffect, useState } from 'react';

const visuallyHiddenStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

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
    <span role="status" aria-atomic="true" style={visuallyHiddenStyle}>
      {announcedMessage}
    </span>
  );
};
