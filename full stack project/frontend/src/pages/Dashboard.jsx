import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="grid" style={{ gap: 16, marginTop: 24 }}>
      <div className="hero">
        <h1>NexusCare</h1>
        <p>Smart community services: complaints, visitors, announcements, and health support.</p>
        {!user && <p>Please login to access protected modules.</p>}
        {user && <p>Welcome back, {user.username} ({user.role}).</p>}
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <Link className="btn" to="/complaints">
            Go to Complaints
          </Link>
          {!user && (
            <Link className="btn secondary" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
