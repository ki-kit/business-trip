import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const generateDayRows = (startStr, endStr) => {
    if (!startStr || !endStr) return [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const rows = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      rows.push({
        date: d.toISOString().split('T')[0],
        timeHour: '08:00',
        durationHours: '24',
        mealProvided: 'None',
        kmDriven: 0,
        driverName: '',
        passengerName: ''
      });
    }
    return rows;
  };

  const createNewTrip = () => ({
    id: Date.now() + Math.random(),
    employeeName: '',
    destination: 'Slovakia',
    startDate: '',
    endDate: '',
    isMacroExecuted: false,
    days: []
  });

  const [trips, setTrips] = useState([createNewTrip()]);
  const [activeTripId, setActiveTripId] = useState(trips[0].id);

  const addTrip = () => {
    const newTrip = createNewTrip();
    setTrips([...trips, newTrip]);
    setActiveTripId(newTrip.id);
  };

  const removeTrip = (id) => {
    if (trips.length === 1) return;
    const filtered = trips.filter(t => t.id !== id);
    setTrips(filtered);
    setActiveTripId(filtered[0].id);
  };

  const updateTrip = (id, fields) => {
    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id !== id) return trip;
      const updated = { ...trip, ...fields };
      if (fields.startDate !== undefined || fields.endDate !== undefined) {
        updated.days = generateDayRows(updated.startDate, updated.endDate);
        updated.isMacroExecuted = false;
      }
      return updated;
    }));
  };

  const updateTripDay = (tripId, dayIndex, updatedDayFields) => {
    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id !== tripId) return trip;
      const updatedDays = [...trip.days];
      updatedDays[dayIndex] = { ...updatedDays[dayIndex], ...updatedDayFields };
      return { ...trip, days: updatedDays };
    }));
  };

  return (
    <AppContext.Provider value={{ trips, activeTripId, setActiveTripId, addTrip, removeTrip, updateTrip, updateTripDay }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);