import './App.css'
import { Route, Routes } from 'react-router-dom'
import { PAGE_HOME, PAGE_WELCOME } from './lib/constants'
import Welcome from './pages/Welcome'
import Home from './pages/Home'

function App() {

  return (
    <>
      <Routes>
        <Route path={PAGE_WELCOME} element={<Welcome />} />
        <Route path={PAGE_HOME} element={<Home />} />
      </Routes>
    </>
  )
}

export default App
