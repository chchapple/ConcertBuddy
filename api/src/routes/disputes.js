import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/disputes?status=
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query
    let q = supabase.from('disputes').select('*, profiles(display_name, photo_url)')
    if (status) q = q.eq('status', status)
    const { data, error } = await q.order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/disputes
router.post('/', async (req, res, next) => {
  try {
    const { user_id, ban_reason, description, media_urls } = req.body
    if (!user_id || !ban_reason || !description) return res.status(400).json({ error: 'user_id, ban_reason, description required' })
    const { data, error } = await supabase
      .from('disputes')
      .insert({ user_id, ban_reason, description, media_urls: media_urls || [] })
      .select()
      .single()
    if (error) return next(error)
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// PATCH /api/disputes/:id — admin review
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, admin_reply, reviewed_by } = req.body
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'status must be approved or rejected' })
    const { data, error } = await supabase
      .from('disputes')
      .update({ status, admin_reply: admin_reply || null, reviewed_by, reviewed_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) return next(error)
    if (!data) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) { next(err) }
})

export default router
