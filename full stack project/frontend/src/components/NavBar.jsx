import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="navbar">
      <Link to="/">NexusCare</Link>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/complaints">Complaints</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button className="btn secondary" onClick={handleLogout}>
            Logout ({user.role})
          </button>
        )}
      </div>
    </div>
  )
}

export default NavBar
