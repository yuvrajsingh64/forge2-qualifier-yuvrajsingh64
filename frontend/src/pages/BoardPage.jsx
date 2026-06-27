import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { boards as boardsApi, lists as listsApi, cards as cardsApi } from '../api'
import { useToast } from '../components/ToastProvider'
import CardModal from '../components/CardModal'
import Avatar from '../components/Avatar'
import TagBadge from '../components/TagBadge'

function TrashIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M5 5.5l.5 5M9 5.5l-.5 5M3 3.5l.5 8a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5l.5-8"/>
    </svg>
  )
}

function ArrowRight({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 5h6M5.5 2l3 3-3 3"/>
    </svg>
  )
}

const FALLBACK_BOARD = {
  id: 1,
  name: 'My First Board',
  description: 'A sample project board to demonstrate the Kanban system.',
  color: '#6366f1',
  members: [
    { id: 1, name: 'Alice', avatar_color: '#6366f1' },
    { id: 2, name: 'Bob', avatar_color: '#10b981' },
  ],
  lists: [
    {
      id: 1,
      name: 'To Do',
      position: 0,
      cards: [
        {
          id: 1,
          title: 'Design database schema',
          description: 'Create ERD and define all entity relationships.',
          due_date: '2026-07-10',
          is_overdue: false,
          member: { id: 1, name: 'Alice', avatar_color: '#6366f1' },
          tags: [{ id: 1, name: 'Planning', color: '#6366f1' }],
        },
      ],
    },
    {
      id: 2,
      name: 'In Progress',
      position: 1,
      cards: [
        {
          id: 2,
          title: 'Build REST API endpoints',
          description: 'Laravel controllers for boards, lists, cards, tags, members.',
          due_date: '2026-06-25',
          is_overdue: true,
          member: { id: 2, name: 'Bob', avatar_color: '#10b981' },
          tags: [{ id: 2, name: 'Backend', color: '#f59e0b' }],
        },
      ],
    },
    {
      id: 3,
      name: 'Done',
      position: 2,
      cards: [
        {
          id: 3,
          title: 'Set up React + Vite project',
          description: 'Scaffold frontend with routing, API module, and design system.',
          due_date: '2026-06-20',
          is_overdue: false,
          member: { id: 1, name: 'Alice', avatar_color: '#6366f1' },
          tags: [{ id: 3, name: 'Frontend', color: '#10b981' }],
        },
      ],
    },
  ],
}

export default function BoardPage() {
  const { boardId } = useParams()
  const [board, setBoard] = useState(FALLBACK_BOARD)
  const [loading, setLoading] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [newListName, setNewListName] = useState('')
  const [addingList, setAddingList] = useState(false)
  const [newCardTitles, setNewCardTitles] = useState({})
  const [addingCard, setAddingCard] = useState(null)
  const toast = useToast()

  const loadBoard = useCallback(() => {
    return boardsApi
      .get(boardId)
      .then(r => { if (r.data) setBoard(r.data) })
      .catch(() => {})
  }, [boardId])

  useEffect(() => { loadBoard() }, [loadBoard])

  const handleAddList = async e => {
    e.preventDefault()
    if (!newListName.trim()) return
    try {
      await listsApi.create(boardId, { name: newListName })
      setNewListName('')
      setAddingList(false)
      await loadBoard()
      toast('List added')
    } catch {
      toast('Failed to add list', 'error')
    }
  }

  const handleDeleteList = async listId => {
    if (!confirm('Delete this list and all its cards?')) return
    try {
      await listsApi.delete(listId)
      await loadBoard()
      toast('List deleted')
    } catch {
      toast('Failed to delete list', 'error')
    }
  }

  const handleAddCard = async (e, listId) => {
    e.preventDefault()
    const title = newCardTitles[listId]?.trim()
    if (!title) return
    try {
      await cardsApi.create(listId, { title })
      setNewCardTitles(prev => ({ ...prev, [listId]: '' }))
      setAddingCard(null)
      await loadBoard()
      toast('Card added')
    } catch {
      toast('Failed to add card', 'error')
    }
  }

  const handleMoveCard = async (card, targetListId) => {
    try {
      await cardsApi.move(card.id, { board_list_id: targetListId })
      await loadBoard()
      toast('Card moved')
    } catch {
      toast('Failed to move card', 'error')
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading board...</span>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="loading-screen">
        <span>Board not found</span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <div className="board-header">
        <div className="board-header-inner">
          <nav className="board-breadcrumb">
            <Link to="/">Boards</Link>
            <span>/</span>
            <span>{board.name}</span>
          </nav>
          <div className="board-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: board.color }} />
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>{board.name}</h1>
            </div>
            <div style={{ display: 'flex', gap: -6 }}>
              {board.members?.map(m => (
                <div key={m.id} style={{ marginLeft: -6 }}>
                  <Avatar member={m} size={30} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="board-columns">
        {board.lists?.map(list => (
          <div key={list.id} id={`list-${list.id}`} className="column">
            <div className="column-header">
              <h3 className="column-title">{list.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="column-count">{list.cards?.length ?? 0}</span>
                <button
                  className="btn-icon"
                  onClick={() => handleDeleteList(list.id)}
                  style={{ color: 'var(--danger)', padding: 4 }}
                  aria-label="Delete list"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="column-cards">
              {list.cards?.map(card => (
                <div
                  key={card.id}
                  id={`card-${card.id}`}
                  className={`card-item glass${card.is_overdue ? ' card-overdue' : ''}`}
                  onClick={() => setSelectedCard({ card, listId: list.id, board })}
                >
                  <div className="card-top">
                    <p className="card-title">{card.title}</p>
                    {card.member && <Avatar member={card.member} size={22} />}
                  </div>

                  {card.tags?.length > 0 && (
                    <div className="card-tags">
                      {card.tags.map(tag => <TagBadge key={tag.id} tag={tag} />)}
                    </div>
                  )}

                  {card.due_date && (
                    <div className={`card-due${card.is_overdue ? ' card-due-overdue' : ''}`}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                        <rect x="1" y="2" width="10" height="9" rx="1.5"/>
                        <path d="M4 1v2M8 1v2M1 5h10"/>
                      </svg>
                      <span>{new Date(card.due_date).toLocaleDateString()}</span>
                      {card.is_overdue && <span className="overdue-label">Overdue</span>}
                    </div>
                  )}

                  {board.lists && board.lists.length > 1 && (
                    <div className="card-moves" onClick={e => e.stopPropagation()}>
                      {board.lists
                        .filter(l => l.id !== list.id)
                        .map(l => (
                          <button
                            key={l.id}
                            className="btn btn-ghost btn-sm card-move-btn"
                            onClick={() => handleMoveCard(card, l.id)}
                          >
                            <ArrowRight />
                            {l.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}

              {addingCard === list.id ? (
                <form onSubmit={e => handleAddCard(e, list.id)} className="add-card-form">
                  <input
                    id={`input-card-title-${list.id}`}
                    className="form-input"
                    placeholder="Card title"
                    value={newCardTitles[list.id] || ''}
                    onChange={e => setNewCardTitles(prev => ({ ...prev, [list.id]: e.target.value }))}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <button type="submit" className="btn btn-primary btn-sm">Add</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAddingCard(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button
                  id={`btn-add-card-${list.id}`}
                  className="add-card-btn"
                  onClick={() => setAddingCard(list.id)}
                >
                  + Add a card
                </button>
              )}
            </div>
          </div>
        ))}

        <div style={{ minWidth: 260, flexShrink: 0 }}>
          {addingList ? (
            <form onSubmit={handleAddList} className="add-list-form">
              <input
                id="input-new-list-name"
                className="form-input"
                placeholder="List name"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary btn-sm">Add list</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAddingList(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button
              id="btn-add-list"
              className="add-list-btn"
              onClick={() => setAddingList(true)}
            >
              + Add a list
            </button>
          )}
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard.card}
          board={selectedCard.board}
          onClose={() => setSelectedCard(null)}
          onSave={() => { setSelectedCard(null); loadBoard() }}
        />
      )}
    </div>
  )
}
