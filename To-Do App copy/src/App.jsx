import { useState } from 'react'
import './App.css'
import ToDo from './components/ToDo'

function App() {
  return (
    <div className='bg-stone-900 grid py-4 min-h-screen'>
      <ToDo/>
    </div>
  )
}

export default App
