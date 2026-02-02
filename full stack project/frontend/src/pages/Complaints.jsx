import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  deleted: 'Deleted',
}

function Complaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [form, setForm] = useState({ title: '', description: '' })
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadComplaints = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/complaints', {
        params: statusFilter ? { status: statusFilter } : {},
      })
      setComplaints(data.complaints)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/complaints', form)
      setForm({ title: '', description: '' })
      loadComplaints()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create complaint')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, { status })
      loadComplaints()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/complaints/${id}`)
      loadComplaints()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete')
    }
  }

  const canEdit = (complaint) => {
    if (!user) return false
    if (user.role === 'admin' || user.role === 'security') return true
    return complaint.created_by === user.id
  }

  return (
    <div className="grid" style={{ gap: 16, marginTop: 24 }}>
      <div className="card">
        <h2>Submit a complaint</h2>
        {error && <div className="badge" style={{ background: '#7f1d1d', color: '#fca5a5' }}>{error}</div>}
        <form className="grid" style={{ gap: 10 }} onSubmit={handleCreate}>
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="textarea"
            rows={3}
            placeholder="Describe the issue"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2>Complaints</h2>
          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>
                    <span className="badge">{statusLabels[c.status] || c.status}</span>
                  </td>
                  <td>{c.created_by_username || c.created_by}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    {canEdit(c) && (
                      <select className="select" value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)}>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
                    {canEdit(c) && (
                      <button className="btn danger" onClick={() => handleDelete(c.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Complaints
