import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/attendance?event_id=&user_id= — query attendance records
router.get('/', async (req, res, next) => {
  try {
    const { event_id, user_id } = req.query
    let query = supabase.from('attendance').select('*')
    if (event_id) query = query.eq('event_id', event_id)
    if (user_id)  query = query.eq('user_id', user_id)

    const { data, error } = await query
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/attendance — register attendance for an event
router.post('/', async (req, res, next) => {
  try {
    const { user_id, event_id, ticket_verified } = req.body
    if (!user_id || !event_id) {
      return res.status(400).json({ error: 'user_id and event_id are required' })
    }

    const { data, error } = await supabase
      .from('attendance')
      .insert({ user_id, event_id, ticket_verified: ticket_verified ?? false })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Already registered for this event' })
      return next(error)
    }
    res.status(201).json(data)
  } catch (err) { next(err) }
})

export default router
