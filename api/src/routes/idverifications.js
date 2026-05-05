import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/id-verifications?status=
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query
    let q = supabase.from('id_verifications').select('*, profiles(display_name, photo_url)')
    if (status) q = q.eq('status', status)
    const { data, error } = await q.order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/id-verifications/user/:userId
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('id_verifications')
      .select('*')
      .eq('user_id', req.params.userId)
      .maybeSingle()
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/id-verifications
router.post('/', async (req, res, next) => {
  try {
    const { user_id, id_image_url } = req.body
    if (!user_id || !id_image_url) return res.status(400).json({ error: 'user_id and id_image_url required' })
    const { data, error } = await supabase
      .from('id_verifications')
      .upsert({ user_id, id_image_url, status: 'pending' }, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) return next(error)
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// PATCH /api/id-verifications/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, rejection_reason, reviewed_by } = req.body
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'status must be approved or rejected' })
    const { data, error } = await supabase
      .from('id_verifications')
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
