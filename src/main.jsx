import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './page/RegisterPage.jsx'
import LoginPage from './page/LoginPage.jsx'
import PublishEvent from './page/PublishEvent.jsx'  
import ViewEventPage from './page/ViewEventPage.jsx'
import HomeEvent from './page/homeEvent.jsx'
import EditEventPage from './page/EditEvenPage.jsx'
import EventDetails from './page/EventDetails.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/home" element={<HomeEvent />} />
        <Route path="/publish" element={<PublishEvent />} />
        <Route path="/Myevents" element={<ViewEventPage />} />
        <Route path="/edit-event/:id" element={<EditEventPage />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
