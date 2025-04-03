// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/LoginPage';
import CreateOrEditOS from './pages/CreateOrEditOS.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/os" element={<CreateOrEditOS />} />
        <Route path="/os/:id" element={<CreateOrEditOS />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
