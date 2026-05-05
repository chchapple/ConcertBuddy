import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/blocks?blocker_id=
router.get('/', async (req, res, next) => {
  try {
    const { blocker_id } = req.query
    if (!blocker_id) return res.status(400).json({ error: 'blocker_id required' })
    const { data, error } = await supabase
      .from('blocks')
      .select('*, profiles!blocks_blocked_id_fkey(display_name, photo_url)')
      .eq('blocker_id', blocker_id)
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/blocks
router.post('/', async (req, res, next) => {
  try {
    const { blocker_id, blocked_id } = req.body
    if (!blocker_id || !blocked_id) return res.status(400).json({ error: 'blocker_id and blocked_id required' })
    const { data, error } = await supabase
      .from('blocks')
      .insert({ blocker_id, blocked_id })
      .select()
      .single()
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Already blocked' })
      return next(error)
    }
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// DELETE /api/blocks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase.from('blocks').delete().eq('id', req.params.id)
    if (error) return next(error)
    res.status(204).send()
  } catch (err) { next(err) }
})

export default router
