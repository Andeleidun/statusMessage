import { useState } from 'react';
import { ScreenReaderStatusMessage } from './index';
import './App.css';

function App() {
  const [cart, setCart] = useState({ count: 0, message: '', sequence: 0 });

  const addItem = () => {
    setCart((current) => {
      const count = current.count + 1;
      const noun = count === 1 ? 'item' : 'items';

      return {
        count,
        message: `Cart updated. ${count} ${noun} in cart.`,
        sequence: current.sequence + 1,
      };
    });
  };

  const resetCart = () => {
    setCart((current) => ({
      count: 0,
      message: current.count === 0 ? 'Cart is already empty.' : 'Cart reset.',
      sequence: current.sequence + 1,
    }));
  };

  return (
    <div className="App container">
      <header>
        <h1>Screen Reader Status Message Tutorial</h1>
      </header>
      <main>
        <p>
          Update the cart without moving focus. The visible count changes, and
          the same result is added to a polite status region.
        </p>
        <p>
          Items in cart: <strong>{cart.count}</strong>
        </p>
        <div className="button-group">
          <button type="button" onClick={addItem}>
            Add item
          </button>
          <button type="button" onClick={resetCart}>
            Reset cart
          </button>
        </div>
        <ScreenReaderStatusMessage
          message={cart.message}
          sequence={cart.sequence}
        />
      </main>
    </div>
  );
}

export default App;
