// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';



const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <button onClick={() => navigate('/application')}>Application DB</button>
      <button onClick={() => navigate('/category')}>Category DB</button>
      <button onClick={() => navigate('/product')}>Product DB</button>
    </div>
  );
};

export default Dashboard;
