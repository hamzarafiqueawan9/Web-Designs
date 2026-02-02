import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ marginTop: 24 }}>
      <div className="card">
        <h2>Welcome back</h2>
        <p className="text-muted">Access your NexusCare workspace</p>
        {error && <div className="badge" style={{ background: '#7f1d1d', color: '#fca5a5' }}>{error}</div>}
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: 12 }}>
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
