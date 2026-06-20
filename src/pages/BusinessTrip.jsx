import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function BusinessTrip() {
  const { trips, addTrip, removeTrip, updateTrip, setActiveTripId } = useApp();
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Business Trip Registry / Zoznam pracovných ciest</h2>
        <button 
          onClick={addTrip}
          style={{ background: '#16a34a', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ➕ Add Another Business Trip
        </button>
      </div>

      {trips.map((trip, idx) => (
        <div 
          key={trip.id} 
          style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '20px', background: '#f8fafc' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#1e3a8a' }}>Trip #{idx + 1} Configuration</h3>
            {trips.length > 1 && (
              <button 
                onClick={() => removeTrip(trip.id)}
                style={{ background: '#ef4444', color: 'white', padding: '4px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                Delete Trip
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Employee Name:</label>
              <input 
                type="text"
                value={trip.employeeName}
                onChange={(e) => updateTrip(trip.id, { employeeName: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Destination Region:</label>
              <select 
                value={trip.destination}
                onChange={(e) => updateTrip(trip.id, { destination: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="Slovakia">Slovakia (Slovenská republika)</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Austria">Austria</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Start Day:</label>
              <input 
                type="date"
                value={trip.startDate}
                onChange={(e) => updateTrip(trip.id, { startDate: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>End Day:</label>
              <input 
                type="date"
                value={trip.endDate}
                onChange={(e) => updateTrip(trip.id, { endDate: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e2e8f0', padding: '10px', borderRadius: '4px' }}>
            <span style={{ fontSize: '14px', color: '#475569' }}>
              {trip.days.length > 0 ? `👉 Interval generated: ${trip.days.length} day(s)` : '⚠️ Please select valid Start and End Days to generate row sheets'}
            </span>
            <button 
              onClick={() => {
                setActiveTripId(trip.id);
                navigate(trip.destination === 'Slovakia' ? '/slovakia' : '/abroad');
              }}
              disabled={trip.days.length === 0}
              style={{ background: '#2563eb', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: trip.days.length === 0 ? 'not-allowed' : 'pointer', opacity: trip.days.length === 0 ? 0.5 : 1 }}
            >
              Configure Expenses
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}