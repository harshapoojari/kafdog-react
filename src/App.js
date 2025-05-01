import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Produce from './components/Produce'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Produce/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App