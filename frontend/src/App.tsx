import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Evaluation from './pages/Evaluation'
import Home from './pages/Home'
import Implementation from './pages/Implementation'
import DeploymentManual from './pages/DeploymentManual'
import DevelopmentBlog from './pages/DevelopmentBlog'
import LegalReference from './pages/LegalReference'
import Requirements from './pages/Requirements'
import Research from './pages/Research'
import SystemDesign from './pages/System_Design'
import Testing from './pages/Testing'
import UIDesign from './pages/UI_Design'
import UserManual from './pages/UserManual'
import Videos from './pages/Videos'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/research" element={<Research />} />
          <Route path="/ui-design" element={<UIDesign />} />
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/implementation" element={<Implementation />} />
          <Route path="/testing" element={<Testing />} />
          <Route
            path="/user-manual"
            element={<Navigate to="/appendices/user-manual" replace />}
          />
          <Route path="/appendices/user-manual" element={<UserManual />} />
          <Route
            path="/appendices/deployment-manual"
            element={<DeploymentManual />}
          />
          <Route
            path="/appendices/development-blog"
            element={<DevelopmentBlog />}
          />
          <Route
            path="/appendices/legal-reference"
            element={<LegalReference />}
          />
          <Route path="/appendices/videos" element={<Videos />} />
          <Route path="/evaluation" element={<Evaluation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
