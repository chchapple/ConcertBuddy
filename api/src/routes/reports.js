import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/reports — list reports (admin, service-role only)
router.get('/', async (req, res, next) => {
  try {
    const { reviewed } = req.query
    let query = supabase
      .from('reports')
      .select(`
        id, reason, reviewed, reviewed_at, created_at,
        reporter:profiles!reports_reporter_id_fkey(id, display_name),
        reported:profiles!reports_reported_id_fkey(id, display_name),
        events(id, artist)
      `)
      .order('created_at', { ascending: false })

    if (reviewed !== undefined) query = query.eq('reviewed', reviewed === 'true')

    const { data, error } = await query
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/reports — submit a report
router.post('/', async (req, res, next) => {
  try {
    const { reporter_id, reported_id, event_id, reason } = req.body

    if (!reporter_id || !reported_id || !reason) {
      return res.status(400).json({ error: 'reporter_id, reported_id, and reason are required' })
    }
    if (reporter_id === reported_id) {
      return res.status(400).json({ error: 'Cannot report yourself' })
    }
    if (!reason.trim()) {
      return res.status(400).json({ error: 'reason cannot be empty' })
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({ reporter_id, reported_id, event_id: event_id || null, reason: reason.trim() })
      .select()
      .single()

    if (error) return next(error)
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// PATCH /api/reports/:id/review — mark a report as reviewed
router.patch('/:id/review', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ reviewed: true, reviewed_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) return res.status(404).json({ error: 'Report not found' })
    res.json(data)
  } catch (err) { next(err) }
})

export default router
