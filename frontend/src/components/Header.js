import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json;
  } catch (e) {
    return null;
  }
}

export default function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const payload = token ? decodeToken(token) : null;
  const name = payload?.name || payload?.email || '';

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <header className="app-topbar">
      <div className="app-topbar-inner">
        <div className="brand">
          <Link to="/dashboard" className="brand-link">Mastek Procurement</Link>
        </div>

        <div className="top-actions">
          {name && <div className="user-name">{name}</div>}
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
