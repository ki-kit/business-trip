import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import BusinessTrip from './pages/BusinessTrip';
import SlovakiaTrip from './pages/SlovakiaTrip';
import AbroadTrip from './pages/AbroadTrip';
import Summary from './pages/Summary';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BusinessTrip />} />
            <Route path="slovakia" element={<SlovakiaTrip />} />
            <Route path="abroad" element={<AbroadTrip />} />
            <Route path="summary" element={<Summary />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;