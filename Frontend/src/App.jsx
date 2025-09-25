import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from "./pages/LandingPage.jsx"
import Authentication from './pages/Authentication.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import VideoMeet from './pages/VideoMeet.jsx'
import HomeComponent from './pages/home.jsx'
import { History } from './pages/History.jsx'

function App() {


  return (
    <>
      <div className="app">
        <Router>
          <AuthProvider>
            <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element= {<LandingPage />} />
            <Route path="/auth" element= {<Authentication />} />
            <Route path = "home" element = {<HomeComponent />} />
            <Route path="/:url" element= {<VideoMeet />} />
            <Route path='/history' element = {<History />} />
          </Routes>
          </AuthProvider>
        </Router>
      </div>
    </>
  )
}

export default App
