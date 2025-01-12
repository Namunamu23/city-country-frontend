// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import WordInput from './components/WordInput';
import GamePage from './components/GamePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1) This is your new initial page */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2) The "lobby" or main page */}
        <Route path="/" element={<WordInput />} />

        {/* 3) The game page route */}
        <Route path="/game/:roomName" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
