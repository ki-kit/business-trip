import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Summary() {
  const { trips, updateTripDays } = useApp();

  // Keep state for row-specific inputs added by user
  const [rowInputs, setRowInputs] = useState({});

  const handleInputChange = (tripId, dayIndex, field, value) => {
    setRowInputs(prev => ({
      ...prev,
      [`${tripId}-${dayIndex}-${field}`]: value
    }));
  };

  const getInputVal = (tripId, dayIndex, field, fallback = '') => {
    return rowInputs[`${tripId}-${dayIndex}-${field}`] ?? fallback;
  };

  // Helper calculation reflecting standard Slovak labor frameworks 
  // and specific base parameters provided in previous builds
  const calculateDailyAllowance = (destination, hoursStr, mealOption) => {
    const hours = parseFloat(hoursStr) || 0;
    if (hours <= 0) return 0;

    let baseRate = destination === 'Slovakia' ? 38.40 : 45.00;
    let allowance = 0;

    if (destination === 'Slovakia') {
      if (hours >= 5 && hours <= 12) allowance = baseRate * 0.40;
      else if (hours > 12 && hours <= 18) allowance = baseRate * 0.60;
      else if (hours > 18) allowance = baseRate;
    } else {
      if (hours <= 6) allowance = baseRate * 0.25;
      else if (hours > 6 && hours <= 12) allowance = baseRate * 0.50;
      else if (hours > 12) allowance = baseRate;
    }

    // Dropdown value deduction configuration matches meal criteria layers
    let reductionPct = 0;
    if (mealOption === 'B') reductionPct = 0.25;
    else if (mealOption === 'L') reductionPct = 0.40;
    else if (mealOption === 'D') reductionPct = 0.35;
    else if (mealOption === 'BL') reductionPct = 0.65;
    else if (mealOption === 'BD') reductionPct = 0.60;
    else if (mealOption === 'LD') reductionPct = 0.75;
    else if (mealOption === 'BLD') reductionPct = 1.00;

    allowance = allowance * (1 - reductionPct);
    return Math.max(0, allowance);
  };

  // Calculate global aggregate totals
  let totalPayableSum = 0;

  return (
    <div>
      <style>{`
        .excel-container {
          font-family: 'Arial', 'Calibri', sans-serif;
          color: #000;
          background: #fff;
          padding: 20px;
        }
        .excel-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 12px;
        }
        .excel-table th, .excel-table td {
          border: 1px solid #7f7f7f;
          padding: 5px 6px;
          vertical-align: middle;
        }
        .excel-header-bg {
          background-color: #e2e8f0;
          font-weight: bold;
          text-align: center;
        }
        .excel-title {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
        }
        .web-btn-section {
          margin-bottom: 20px;
          background: #f1f5f9;
          padding: 15px;
          border-radius: 6px;
        }
        .matrix-input {
          width: 90%;
          padding: 3px;
          font-size: 11px;
          border: 1px solid #cbd5e1;
          border-radius: 3px;
        }
        select.matrix-input {
          padding: 2px;
        }

        @media print {
          body {
            background: #fff;
            color: #000;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .web-btn-section, .no-print {
            display: none !important;
          }
          .excel-container {
            padding: 0;
            width: 100%;
          }
          .excel-table th {
            background-color: #cbd5e1 !important;
            -webkit-print-color-adjust: exact;
          }
          .matrix-input {
            border: none !important;
            background: transparent !important;
            appearance: none !important;
            -moz-appearance: none !important;
            -webkit-appearance: none !important;
            color: black !important;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Action configuration head block */}
      <div className="web-btn-section">
        <h3 style={{ margin: '0 0 10px 0' }}>Export Worksheet Matrix</h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#475569' }}>
          Fill in the specific row metrics below. When complete, click the render button to initialize the matching layout structure.
        </p>
        <button 
          onClick={() => window.print()} 
          style={{ background: '#e11d48', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
        >
          🖨️ Generate Official PDF Document
        </button>
      </div>

      <div className="excel-container">
        <div className="excel-title">Vyúčtovanie pracovnej cesty</div>
        <div className="excel-title" style={{ fontSize: '13px', marginBottom: '15px' }}>Business Travel & Expense Claim Form (Controls-F-014-T_sk,en)</div>

        {/* Master Tracking Log Structure */}
        <table className="excel-table">
          <thead>
            <tr className="excel-header-bg">
              <th style={{ width: '9%' }}>Dátum<br/><span style={{fontWeight:'normal', fontSize:'10px'}}>Date</span></th>
              <th style={{ width: '8%' }}>Čas / Hodina<br/><span style={{fontWeight:'normal', fontSize:'10px'}}>Time/Hour</span></th>
              <th style={{ width: '12%' }}>Trvanie (hod)<br/><span style={{fontWeight:'normal', fontSize:'10px'}}>Duration (hrs)</span></th>
              <th style={{ width: '14%' }}>Strava<br/><span style={{fontWeight:'normal', fontSize:'10px'}}>Meal Provided</span></th>
              <th style={{ width: '13%' }}>Náhrada<br/><span style={{fontWeight:'normal', fontSize:'10px'}}>Allowance Pay</span></th>
              <th>Meno vodiča<br/><span style={{fontWeight:'normal', fontSize:'10px'}}>Driver's Name</span></th>
              <th>Meno spolujazdca<br/><span style={{fontWeight:'normal', fontSize:'10px'}}>Passenger's Name</span></th>
            </tr>
          </thead>
          <tbody>
            {trips.flatMap((t) => 
              t.days.map((day, idx) => {
                const rowTime = getInputVal(t.id, idx, 'time', '08:00');
                const rowDuration = getInputVal(t.id, idx, 'duration', t.destination === 'Slovakia' ? '24' : '24');
                const rowMeal = getInputVal(t.id, idx, 'meal', 'None');
                
                const dayAllowance = calculateDailyAllowance(t.destination, rowDuration, rowMeal);
                totalPayableSum += dayAllowance;

                return (
                  <tr key={`${t.id}-${idx}`}>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{day.dateString || t.startDate || '-'}</td>
                    <td>
                      <input 
                        type="text" 
                        className="matrix-input" 
                        value={rowTime} 
                        onChange={(e) => handleInputChange(t.id, idx, 'time', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="matrix-input" 
                        value={rowDuration} 
                        onChange={(e) => handleInputChange(t.id, idx, 'duration', e.target.value)} 
                      />
                    </td>
                    <td>
                      <select 
                        className="matrix-input"
                        value={rowMeal}
                        onChange={(e) => handleInputChange(t.id, idx, 'meal', e.target.value)}
                      >
                        <option value="None">- Select -</option>
                        <option value="B">B (Raňajky)</option>
                        <option value="L">L (Obed)</option>
                        <option value="D">D (Večera)</option>
                        <option value="BL">BL</option>
                        <option value="BD">BD</option>
                        <option value="LD">LD</option>
                        <option value="BLD">BLD</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                      {dayAllowance.toFixed(2)} EUR
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="matrix-input" 
                        placeholder="Driver"
                        value={getInputVal(t.id, idx, 'driver')} 
                        onChange={(e) => handleInputChange(t.id, idx, 'driver', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="matrix-input" 
                        placeholder="Passengers"
                        value={getInputVal(t.id, idx, 'passenger')} 
                        onChange={(e) => handleInputChange(t.id, idx, 'passenger', e.target.value)} 
                      />
                    </td>
                  </tr>
                );
              })
            )}
            
            {/* Aggregate Ledger Sum Row */}
            <tr style={{ background: '#f1f5f9', fontWeight: 'bold' }}>
              <td colSpan="4" style={{ textAlign: 'right' }}>Celková suma k úhrade / Grand Total Payable:</td>
              <td style={{ textAlign: 'right', color: '#16a34a', fontSize: '13px' }}>{totalPayableSum.toFixed(2)} EUR</td>
              <td colSpan="2" style={{ background: '#fff', border: 'none' }}></td>
            </tr>
          </tbody>
        </table>

        {/* Corporate Approvals Matrix Block */}
        <div style={{ marginTop: '35px' }}>
          <table className="excel-table" style={{ border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ border: 'none', width: '30%', paddingTop: '35px', borderTop: '1px solid #000', textAlign: 'center' }}>
                  Podpis zamestnanca / <strong>Employee Signature</strong>
                </td>
                <td style={{ border: 'none', width: '5%' }}></td>
                <td style={{ border: 'none', width: '30%', paddingTop: '35px', borderTop: '1px solid #000', textAlign: 'center' }}>
                  Skontroloval / <strong>Checked by</strong>
                </td>
                <td style={{ border: 'none', width: '5%' }}></td>
                <td style={{ border: 'none', width: '30%', paddingTop: '35px', borderTop: '1px solid #000', textAlign: 'center' }}>
                  Schválil (Manažér) / <strong>Approved by</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}