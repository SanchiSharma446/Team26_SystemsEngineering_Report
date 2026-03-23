import { Route, Routes } from 'react-router-dom'
import Header from './Header'
import Appendix from './pages/Appendix'
import Evaluation from './pages/Evaluation'
import Home from './pages/Home'
import Implementation from './pages/Implementation'
import Requirements from './pages/Requirements'
import Research from './pages/Research'
import SystemDesign from './pages/System_Design'
import Testing from './pages/Testing'
import UIDesign from './pages/UI_Design'
import UserManual from './pages/UserManual'
import './App.css'

function App() {

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/research" element={<Research />} />
        <Route path="/ui-design" element={<UIDesign />} />
        <Route path="/system-design" element={<SystemDesign />} />
        <Route path="/implementation" element={<Implementation />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/user-manual" element={<UserManual />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/appendices" element={<Appendix />} />
      </Routes>
    </div>
  )
}

export default App
