import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/tickets?event_id=&user_id=&status=
router.get('/', async (req, res, next) => {
  try {
    const { event_id, user_id, status } = req.query
    let q = supabase.from('ticket_verifications').select('*, profiles(display_name, photo_url), events(artist)')
    if (event_id) q = q.eq('event_id', event_id)
    if (user_id)  q = q.eq('user_id', user_id)
    if (status)   q = q.eq('status', status)
    const { data, error } = await q.order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/tickets — submit ticket
router.post('/', async (req, res, next) => {
  try {
    const { user_id, event_id, ticket_url } = req.body
    if (!user_id || !event_id || !ticket_url) return res.status(400).json({ error: 'user_id, event_id, ticket_url required' })
    const { data, error } = await supabase
      .from('ticket_verifications')
      .upsert({ user_id, event_id, ticket_url, status: 'pending' }, { onConflict: 'user_id,event_id' })
      .select()
      .single()
    if (error) return next(error)
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// PATCH /api/tickets/:id — approve or reject (admin)
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, rejection_reason, reviewed_by } = req.body
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'status must be approved or rejected' })
    const { data, error } = await supabase
      .from('ticket_verifications')
      .update({ status, rejection_reason: rejection_reason || null, reviewed_by, reviewed_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) return next(error)
    if (!data) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) { next(err) }
})

export default router
