import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import eventsRouter    from './routes/events.js'
import profilesRouter  from './routes/profiles.js'
import attendanceRouter from './routes/attendance.js'
import matchesRouter   from './routes/matches.js'
import messagesRouter  from './routes/messages.js'
import reportsRouter   from './routes/reports.js'

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

app.use('/api/events',     eventsRouter)
app.use('/api/profiles',   profilesRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/matches',    matchesRouter)
app.use('/api/messages',   messagesRouter)
app.use('/api/reports',    reportsRouter)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`ConcertBuddy API running on http://localhost:${PORT}`))
