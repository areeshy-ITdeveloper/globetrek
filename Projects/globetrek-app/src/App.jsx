import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages Import
import GlobeTrekLanding from "./GlobeTrekLanding.jsx";
import GlobeTrekPlanner from './GlobeTrekPlanner';
import { HelpCenter, ContactUs } from './GlobeTrekSupport'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌟 1. FIX: Agar koi sirf '/' par aaye, toh use cleanly '/globetrek' par redirect karo */}
        <Route path="/" element={<Navigate to="/globetrek" replace />} />
        
        {/* 🏠 Main Landing Page Route */}
        <Route path="/globetrek" element={<GlobeTrekLanding />} />
        
        {/* 🗺️ Interactive Dashboard/Planner Route */}
        <Route path="/planner" element={<GlobeTrekPlanner />} />
        
        {/* 🛠️ Support Routes */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        
        {/* 🔄 2. FIX: Fallback route ko bhi badal kar '/globetrek' karein taaki galat URL par loop na bane */}
        <Route path="*" element={<Navigate to="/globetrek" replace />} />
      </Routes>
    </Router>
  );
}

export default App;