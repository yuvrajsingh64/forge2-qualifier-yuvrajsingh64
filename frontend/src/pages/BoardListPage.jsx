import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { boards as boardsApi } from '../api'
import { useToast } from '../components/ToastProvider'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']

function DeleteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M5 5.5l.5 5M9 5.5l-.5 5M3 3.5l.5 8a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5l.5-8"/>
    </svg>
  )
}

export default function BoardListPage() {
  const [boardList, setBoardList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', color: COLORS[0] })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    boardsApi
      .list()
      .then(r => setBoardList(r.data))
      .catch(() => toast('Failed to load boards', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async e => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const r = await boardsApi.create(form)
      setBoardList(prev => [...prev, r.data])
      setShowCreate(false)
      setForm({ name: '', description: '', color: COLORS[0] })
      toast('Board created')
      navigate(`/boards/${r.data.id}`)
    } catch {
      toast('Failed to create board', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Delete this board and all its data?')) return
    try {
      await boardsApi.delete(id)
      setBoardList(prev => prev.filter(b => b.id !== id))
      toast('Board deleted')
    } catch {
      toast('Failed to delete board', 'error')
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Boards</h1>
          <p className="page-subtitle">Manage your projects and tasks</p>
        </div>
        <button id="btn-create-board" className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 1v12M1 7h12"/>
          </svg>
          New Board
        </button>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      ) : boardList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35">
              <rect x="4" y="8" width="12" height="32" rx="3"/>
              <rect x="20" y="8" width="12" height="20" rx="3"/>
              <rect x="36" y="8" width="8" height="14" rx="3"/>
            </svg>
          </div>
          <div className="empty-state-title">No boards yet</div>
          <div className="empty-state-desc">Create your first board to start organising your work</div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create a board</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, paddingBottom: 40 }}>
          {boardList.map(board => (
            <div
              key={board.id}
              id={`board-card-${board.id}`}
              className="board-card glass"
              onClick={() => navigate(`/boards/${board.id}`)}
              style={{ '--board-color': board.color }}
            >
              <div className="board-card-stripe" />
              <div className="board-card-body">
                <div className="board-card-header">
                  <h3 className="board-card-name">{board.name}</h3>
                  <button
                    className="btn-icon"
                    onClick={e => handleDelete(e, board.id)}
                    style={{ color: 'var(--danger)' }}
                    aria-label="Delete board"
                  >
                    <DeleteIcon />
                  </button>
                </div>
                {board.description && (
                  <p className="board-card-desc">{board.description}</p>
                )}
                <div className="board-card-meta">
                  <span>{board.lists?.length ?? 0} lists</span>
                  <span className="sep">·</span>
                  <span>{board.members?.length ?? 0} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create board</h2>
              <button className="btn-icon" onClick={() => setShowCreate(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1l12 12M13 1L1 13"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    id="input-board-name"
                    className="form-input"
                    placeholder="e.g. Product Roadmap"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="What is this board for?"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setForm(f => ({ ...f, color: c }))}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: c,
                          border: form.color === c ? '3px solid #fff' : '3px solid transparent',
                          transition: 'transform 0.15s ease',
                          transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                <button id="btn-create-board-submit" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
                  Create board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
