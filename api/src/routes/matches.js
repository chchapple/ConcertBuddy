import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/matches?user_id= — all active matches for a user
router.get('/', async (req, res, next) => {
  try {
    const { user_id } = req.query
    if (!user_id) return res.status(400).json({ error: 'user_id is required' })

    const { data, error } = await supabase
      .from('matches')
      .select(`
        id, active, created_at,
        events(id, artist, event_date, venues(name)),
        user1:profiles!matches_user1_id_fkey(id, display_name, photo_url, avg_rating),
        user2:profiles!matches_user2_id_fkey(id, display_name, photo_url, avg_rating)
      `)
      .or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/matches/swipe — record a swipe; create match if mutual
router.post('/swipe', async (req, res, next) => {
  try {
    const { swiper_id, swiped_id, event_id, direction } = req.body
    if (!swiper_id || !swiped_id || !event_id || !direction) {
      return res.status(400).json({ error: 'swiper_id, swiped_id, event_id, and direction are required' })
    }
    if (!['like', 'pass'].includes(direction)) {
      return res.status(400).json({ error: "direction must be 'like' or 'pass'" })
    }
    if (swiper_id === swiped_id) {
      return res.status(400).json({ error: 'Cannot swipe on yourself' })
    }

    // Insert swipe
    const { error: swipeErr } = await supabase
      .from('swipes')
      .insert({ swiper_id, swiped_id, event_id, direction })

    if (swipeErr) {
      if (swipeErr.code === '23505') return res.status(409).json({ error: 'Already swiped on this user for this event' })
      return next(swipeErr)
    }

    // If like, check for mutual like
    if (direction === 'like') {
      const { data: mutual } = await supabase
        .from('swipes')
        .select('id')
        .eq('swiper_id', swiped_id)
        .eq('swiped_id', swiper_id)
        .eq('event_id', event_id)
        .eq('direction', 'like')
        .single()

      if (mutual) {
        // Create match with canonical ordering (smaller UUID first)
        const [u1, u2] = [swiper_id, swiped_id].sort()
        const { data: match, error: matchErr } = await supabase
          .from('matches')
          .insert({ user1_id: u1, user2_id: u2, event_id })
          .select()
          .single()

        if (matchErr && matchErr.code !== '23505') return next(matchErr)
        return res.status(201).json({ matched: true, match: match || null })
      }
    }

    res.status(201).json({ matched: false })
  } catch (err) { next(err) }
})

// PATCH /api/matches/:id/unmatch — deactivate a match
router.patch('/:id/unmatch', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .update({ active: false })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) return res.status(404).json({ error: 'Match not found' })
    res.json(data)
  } catch (err) { next(err) }
})

export default router
