import { ScreenReaderStatusMessage } from './ScreenReaderStatusMessage';
import React from 'react';
import { render, screen } from '@testing-library/react';

// These tests are designed to test against the three tests of
// WCAG Technique ARIA22, found here: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22.html
describe('ScreenReaderStatusMessage', () => {
  let message;

  const testRender = ({ message }) => {
    return render(<ScreenReaderStatusMessage message={message} />);
  };

  // 1. Check that the container destined to hold the status message has
  // a role attribute with a value of status before the status message occurs.
  it('should render empty with undefined message', () => {
    testRender({ message });
    const status = screen.queryByRole('status');
    expect(status).toHaveTextContent('');
  });

  // 2. Check that when the status message is triggered, it is inside the container.
  it('should render passed string status message', () => {
    message = 'status message';
    testRender({ message });
    const status = screen.queryByRole('status');
    expect(status).toHaveTextContent('status message');
  });

  // Check that elements or attributes that provide information equivalent to
  // the visual experience for the status message (such as a shopping cart image
  // with proper alt text) also reside in the container.
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
