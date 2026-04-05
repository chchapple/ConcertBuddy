import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/messages?match_id= — all messages for a match
router.get('/', async (req, res, next) => {
  try {
    const { match_id } = req.query
    if (!match_id) return res.status(400).json({ error: 'match_id is required' })

    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, content, media_url, msg_type, created_at')
      .eq('match_id', match_id)
      .order('created_at', { ascending: true })

    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/messages — send a message
router.post('/', async (req, res, next) => {
  try {
    const { match_id, sender_id, content, media_url, msg_type = 'text' } = req.body

    if (!match_id || !sender_id) {
      return res.status(400).json({ error: 'match_id and sender_id are required' })
    }
    if (!['text', 'image'].includes(msg_type)) {
      return res.status(400).json({ error: "msg_type must be 'text' or 'image'" })
    }
    if (msg_type === 'text'  && !content)   return res.status(400).json({ error: 'content is required for text messages' })
    if (msg_type === 'image' && !media_url) return res.status(400).json({ error: 'media_url is required for image messages' })

    // Verify match is active
    const { data: match, error: matchErr } = await supabase
      .from('matches')
      .select('active')
      .eq('id', match_id)
      .single()

    if (matchErr || !match) return res.status(404).json({ error: 'Match not found' })
    if (!match.active)      return res.status(403).json({ error: 'Cannot send messages to an inactive match' })

    const { data, error } = await supabase
      .from('messages')
      .insert({ match_id, sender_id, content, media_url, msg_type })
      .select()
      .single()

    if (error) return next(error)
    res.status(201).json(data)
  } catch (err) { next(err) }
})

export default router
