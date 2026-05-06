import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Send, ArrowLeft, UserX, Flag } from 'lucide-react'
import { getMessages, sendMessage as apiSendMessage } from '../api/index.js'
import { useAuth } from '../context/AuthContext.jsx'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function Chat() {
  const { id } = useParams()
  const { session } = useAuth()
  const myId = session?.user?.id
  const [messages, setMessages] = useState([])
  const [matchInfo, setMatchInfo] = useState(null)
  const [input, setInput] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    getMessages(id)
      .then(data => setMessages(data.map(m => ({ ...m, senderId: m.senderId ?? m.sender_id, msgType: m.msgType ?? m.msg_type, createdAt: m.createdAt ?? m.created_at }))))
      .catch(() => setMessages([]))
  }, [id])

  useEffect(() => {
    const BASE = import.meta.env.VITE_API_BASE_URL
    fetch(`${BASE}/api/matches/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setMatchInfo(data) })
      .catch(() => {})
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const other = matchInfo ? (matchInfo.user1?.id === myId ? matchInfo.user2 : matchInfo.user1) : null
  const otherName = other?.display_name ?? other?.displayName ?? 'Match'
  const otherPhoto = other?.photo_url ?? other?.photoUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
  const eventArtist = matchInfo?.events?.artist ?? matchInfo?.eventArtist ?? ''

  function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || !myId) return
    const optimistic = { id: `msg_${Date.now()}`, senderId: myId, content: input.trim(), msgType: 'text', createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    setInput('')
    apiSendMessage({ match_id: id, sender_id: myId, content: optimistic.content, msg_type: 'text' }).catch(() => {})
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link to="/messages" className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <img src={otherPhoto} alt={otherName} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">{otherName}</p>
          <p className="text-xs text-brand-400">{eventArtist}</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(s => !s)}
            className="text-gray-500 hover:text-gray-300 p-1 transition">
            ···
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg w-44 z-10 overflow-hidden">
              <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition">
                <UserX size={14} /> Unmatch
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-400 hover:bg-gray-700 transition">
                <Flag size={14} /> Report User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {messages.map(msg => {
          const isMe = msg.senderId === myId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                isMe ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm'
              }`}>
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-brand-200' : 'text-gray-500'}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 mt-3">
        <input
          className="input flex-1"
          placeholder="Type a message…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" disabled={!input.trim()} className="btn-primary px-4">
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
