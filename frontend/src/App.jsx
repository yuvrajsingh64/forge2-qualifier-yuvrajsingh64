import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ToastProvider from './components/ToastProvider'
import BoardListPage from './pages/BoardListPage'
import BoardPage from './pages/BoardPage'

export default function App() {
  return (
    <ToastProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<BoardListPage />} />
          <Route path="/boards/:boardId" element={<BoardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  )
}
