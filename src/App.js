import React from 'react';
import { ScreenReaderStatusMessage } from './components/ScreenReaderStatusMessage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Screen Reader Status Message Tutorial</h1>
      </header>
      <main>
        <p>Hello World</p>
        <ScreenReaderStatusMessage message="test" />
      </main>
    </div>
  );
}

export default App;
