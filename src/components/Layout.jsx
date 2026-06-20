import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const location = useLocation();
  const { trips, activeTripId, setActiveTripId } = useApp();
  const currentTrip = trips.find(t => t.id === activeTripId) || trips[0];

  const navItemStyle = (path) => ({
    padding: '10px 15px',
    borderRadius: '5px',
    textDecoration: 'none',
    background: location.pathname === path ? '#2563eb' : '#e5e7eb',
    color: location.pathname === path ? 'white' : 'black',
    fontWeight: 'bold',
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#1e3a8a', color: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Business Travel & Expense Claim</h1>
        
        {/* Quick switch between added trips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px' }}>Active Workspace:</span>
          <select 
            value={activeTripId} 
            onChange={(e) => setActiveTripId(Number(e.target.value))}
            style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}
          >
            {trips.map((t, idx) => (
              <option key={t.id} value={t.id}>
                Trip {idx + 1} ({t.destination})
              </option>
            ))}
          </select>
        </div>
      </header>
      
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
        <Link to="/" style={navItemStyle('/')}>1. Business Trip Registry</Link>
        {currentTrip.destination === 'Slovakia' ? (
          <Link to="/slovakia" style={navItemStyle('/slovakia')}>2. Expense Log (Slovakia)</Link>
        ) : (
          <Link to="/abroad" style={navItemStyle('/abroad')}>2. Expense Log (Abroad)</Link>
        )}
        <Link to="/summary" style={navItemStyle('/summary')}>3. Summary Matrix</Link>
      </nav>

      <main style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <Outlet />
      </main>
    </div>
  );
}