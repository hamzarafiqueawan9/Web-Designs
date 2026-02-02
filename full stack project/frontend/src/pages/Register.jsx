import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { value: 'resident', label: 'Resident' },
  { value: 'security', label: 'Security Staff' },
  { value: 'medical', label: 'Medical Assistant' },
  { value: 'admin', label: 'Admin' },
]

function Register() {
  const { register } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'resident' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await register(form)
      setSuccess('Account created. You can login now.')
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      // surface more info for debugging: status + response body (if present)
      // also log the full error to console
      // eslint-disable-next-line no-console
      console.debug('register error', err)
      const status = err.response?.status
      const body = err.response?.data
      const serverMsg = body?.error || body?.message || (body && JSON.stringify(body))
      setError(
        serverMsg ? `Registration failed (${status}): ${serverMsg}` : err.message || 'Registration failed',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ marginTop: 24 }}>
      <div className="card">
        <h2>Create account</h2>
        {error && <div className="badge" style={{ background: '#7f1d1d', color: '#fca5a5' }}>{error}</div>}
        {success && <div className="badge" style={{ background: '#0b3c34', color: '#6ee7b7' }}>{success}</div>}
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input className="input" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div>
            <label>Role</label>
            <select className="select" name="role" value={form.role} onChange={handleChange}>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
