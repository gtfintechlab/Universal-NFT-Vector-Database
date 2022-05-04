import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Dashboard/>}/>
    </Routes>
  </BrowserRouter>  );
}

export default App;
