import React from 'react';
import { useApp } from '../context/AppContext';

export default function AbroadTrip() {
  const { trips, activeTripId, updateTrip, updateTripDay } = useApp();
  const currentTrip = trips.find(t => t.id === activeTripId) || trips[0];

  const calculateRowAllowance = (hoursStr, mealOption) => {
    const hours = parseFloat(hoursStr) || 0;
    if (hours <= 0) return 0;
    
    let baseRate = 45.00;
    let allowance = 0;

    if (hours <= 6) allowance = baseRate * 0.25;
    else if (hours > 6 && hours <= 12) allowance = baseRate * 0.50;
    else if (hours > 12) allowance = baseRate;

    let reductionPct = 0;
    if (mealOption === 'B') reductionPct = 0.25;
    else if (mealOption === 'L') reductionPct = 0.40;
    else if (mealOption === 'D') reductionPct = 0.35;
    else if (mealOption === 'BL') reductionPct = 0.65;
    else if (mealOption === 'BD') reductionPct = 0.60;
    else if (mealOption === 'LD') reductionPct = 0.75;
    else if (mealOption === 'BLD') reductionPct = 1.00;

    return Math.max(0, allowance * (1 - reductionPct));
  };

  return (
    <div>
      <h2>Business Trip Abroad Expenses ({currentTrip.destination})</h2>
      <p>Employee: <strong>{currentTrip.employeeName || 'Not Set'}</strong> | Interval: {currentTrip.startDate} to {currentTrip.endDate}</p>

      {currentTrip.days.length === 0 ? (
        <p style={{ color: '#ef4444' }}>Please set your start/end dates on the first page to generate row sheets.</p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Time/Hour</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Duration (hrs)</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Meal Provided</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Daily Allowance</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Driver's Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Passenger's Name</th>
              </tr>
            </thead>
            <tbody>
              {currentTrip.days.map((day, idx) => {
                const allowance = calculateRowAllowance(day.durationHours, day.mealProvided);
                return (
                  <tr key={day.date}>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{day.date}</td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                      <input type="text" value={day.timeHour} onChange={(e) => updateTripDay(currentTrip.id, idx, { timeHour: e.target.value })} style={{ width: '90%', padding: '4px' }} />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                      <input type="number" value={day.durationHours} onChange={(e) => updateTripDay(currentTrip.id, idx, { durationHours: e.target.value })} style={{ width: '90%', padding: '4px' }} />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                      <select value={day.mealProvided} onChange={(e) => updateTripDay(currentTrip.id, idx, { mealProvided: e.target.value })} style={{ width: '100%', padding: '4px' }}>
                        <option value="None">- None -</option>
                        <option value="B">B</option>
                        <option value="L">L</option>
                        <option value="D">D</option>
                        <option value="BL">BL</option>
                        <option value="BD">BD</option>
                        <option value="LD">LD</option>
                        <option value="BLD">BLD</option>
                      </select>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right', fontWeight: 'bold', background: '#f8fafc' }}>
                      {allowance.toFixed(2)} EUR
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                      <input type="text" value={day.driverName} onChange={(e) => updateTripDay(currentTrip.id, idx, { driverName: e.target.value })} style={{ width: '90%', padding: '4px' }} />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                      <input type="text" value={day.passengerName} onChange={(e) => updateTripDay(currentTrip.id, idx, { passengerName: e.target.value })} style={{ width: '90%', padding: '4px' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button 
            onClick={() => updateTrip(currentTrip.id, { isMacroExecuted: true })} 
            style={{ background: '#16a34a', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ⚙️ Click "Make It" (Lock Form & Apply Layout Summary)
          </button>
        </div>
      )}
    </div>
  );
}