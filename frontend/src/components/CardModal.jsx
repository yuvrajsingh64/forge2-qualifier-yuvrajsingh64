import { useState, useEffect } from 'react'
import { cards as cardsApi, members as membersApi } from '../api'
import { useToast } from './ToastProvider'
import Avatar from './Avatar'
import TagBadge from './TagBadge'

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 1l12 12M13 1L1 13"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M5 5.5l.5 5M9 5.5l-.5 5M3 3.5l.5 8a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5l.5-8"/>
    </svg>
  )
}

export default function CardModal({ card, board, onClose, onSave }) {
  const [form, setForm] = useState({
    title: card.title,
    description: card.description || '',
    due_date: card.due_date ? card.due_date.substring(0, 10) : '',
    member_id: card.member?.id || '',
  })
  const [allMembers, setAllMembers] = useState([])
  const [cardTags, setCardTags] = useState(card.tags || [])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    membersApi.list().then(r => setAllMembers(r.data)).catch(() => {})
  }, [])

  const handleSave = async e => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    try {
      await cardsApi.update(card.id, {
        title: form.title,
        description: form.description || null,
        due_date: form.due_date || null,
        member_id: form.member_id || null,
      })
      toast('Card updated')
      onSave()
    } catch {
      toast('Failed to update card', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this card?')) return
    setDeleting(true)
    try {
      await cardsApi.delete(card.id)
      toast('Card deleted')
      onSave()
    } catch {
      toast('Failed to delete card', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleAddTag = async tag => {
    if (cardTags.find(t => t.id === tag.id)) return
    try {
      await cardsApi.addTag(card.id, tag.id)
      setCardTags(prev => [...prev, tag])
      toast('Tag added')
    } catch {
      toast('Failed to add tag', 'error')
    }
  }

  const handleRemoveTag = async tag => {
    try {
      await cardsApi.removeTag(card.id, tag.id)
      setCardTags(prev => prev.filter(t => t.id !== tag.id))
    } catch {
      toast('Failed to remove tag', 'error')
    }
  }

  const availableTags = board.tags?.filter(t => !cardTags.find(ct => ct.id === t.id)) || []
  const isOverdue = form.due_date && new Date(form.due_date) < new Date()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit card</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                id="input-card-title-modal"
                className="form-input"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Add details..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select
                  id="select-card-member"
                  className="form-input"
                  value={form.member_id}
                  onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))}
                >
                  <option value="">Unassigned</option>
                  {board.members?.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Due date
                  {isOverdue && <span style={{ color: 'var(--danger)', marginLeft: 6, fontSize: 11 }}>Overdue</span>}
                </label>
                <input
                  id="input-card-due-date"
                  type="date"
                  className="form-input"
                  value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                  style={isOverdue ? { borderColor: 'var(--danger)' } : {}}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 28 }}>
                {cardTags.map(tag => (
                  <TagBadge key={tag.id} tag={tag} onRemove={handleRemoveTag} />
                ))}
                {cardTags.length === 0 && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No tags</span>
                )}
              </div>
            </div>

            {availableTags.length > 0 && (
              <div className="form-group">
                <label className="form-label">Add tag</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {availableTags.map(tag => (
                    <button
                      type="button"
                      key={tag.id}
                      onClick={() => handleAddTag(tag)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 10px',
                        borderRadius: 100,
                        border: `1px dashed ${tag.color}77`,
                        background: 'transparent',
                        color: tag.color,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {form.member_id && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar member={board.members?.find(m => m.id == form.member_id)} size={30} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {board.members?.find(m => m.id == form.member_id)?.name}
                </span>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <TrashIcon />}
              Delete
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button id="btn-save-card" type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
