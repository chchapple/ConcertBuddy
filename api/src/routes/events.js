import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/events — list all upcoming events (with venue info)
router.get('/', async (req, res, next) => {
  try {
    const { artist, venue, date } = req.query
    let query = supabase
      .from('events')
      .select(`*, venues(name, address, city, state)`)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })

    if (artist) query = query.ilike('artist', `%${artist}%`)
    if (venue)  query = query.ilike('venues.name', `%${venue}%`)
    if (date)   query = query.gte('event_date', `${date}T00:00:00`).lte('event_date', `${date}T23:59:59`)

    const { data, error } = await query
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/events/:id — single event
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`*, venues(name, address, city, state)`)
      .eq('id', req.params.id)
      .single()

    if (error) return res.status(404).json({ error: 'Event not found' })
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/events/:id/attendees — verified attendees for an event
router.get('/:id/attendees', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select(`profiles(id, display_name, bio, age, gender, favorite_artists, favorite_genres, has_ride, photo_url, avg_rating)`)
      .eq('event_id', req.params.id)
      .eq('ticket_verified', true)

    if (error) return next(error)
    const profiles = data.map(row => row.profiles).filter(Boolean)
    res.json(profiles)
  } catch (err) { next(err) }
})

export default router
