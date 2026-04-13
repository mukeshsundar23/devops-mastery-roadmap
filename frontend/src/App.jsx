import { useState } from 'react'
import Login from './Login'
import DevOpsRoadmap from './devops-mastery-roadmap'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return <DevOpsRoadmap token={token} onLogout={handleLogout} />
}

export default App