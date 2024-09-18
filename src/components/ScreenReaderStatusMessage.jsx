import React from 'react';

export const ScreenReaderStatusMessage = ({ message }) => {
  return (
    <span role="status" className="hidden">
      {message}
    </span>
  );
};
