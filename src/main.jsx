import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import KioskApp from './kiosk.jsx'
import CoachApp from './coach.jsx'
import './styles/tokens.css'
import './styles/app.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/kiosk" element={<KioskApp />} />
        <Route path="/coach" element={<CoachApp />} />
        <Route path="*" element={<Navigate to="/coach" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
