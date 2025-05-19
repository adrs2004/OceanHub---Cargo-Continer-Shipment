import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './pages/Navbar'
import Homepage from './pages/HomePage'
import Services from './pages/Services'
import Footer from './pages/Footer'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow" style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
        <Footer /> 
      </div>
    </Router>
  )
}