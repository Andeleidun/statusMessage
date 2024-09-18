import { ScreenReaderStatusMessage } from './ScreenReaderStatusMessage';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('ScreenReaderStatusMessage', () => {
  let message;

  const testRender = ({ message }) => {
    return render(<ScreenReaderStatusMessage message={message} />);
  };

  it('should render empty with undefined message', () => {
    testRender({ message });
    const status = screen.queryByRole('status');
    expect(status).toHaveTextContent('');
  });

  it('should render passed string status message', () => {
    message = 'status message';
    testRender({ message });
    const status = screen.queryByRole('status');
    expect(status).toHaveTextContent('status message');
  });

  it('should render passed JSX status message', () => {
    const number = 7;
    const labelCart = 'items in shopping';
    message = (
      <div>
        {number} {labelCart} <img alt="cart" />
      </div>
    );
    testRender({ message });
    const status = screen.queryByRole('status');
    expect(status).toHaveTextContent(`7 ${labelCart}`);
    expect(screen.getByAltText('cart')).toBeTruthy();
  });
});
