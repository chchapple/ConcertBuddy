import { Router } from 'express'
import supabase from '../supabase.js'

const router = Router()

// GET /api/profiles/:id — single profile
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, bio, age, gender, favorite_artists, favorite_genres, has_ride, photo_url, avg_rating, created_at')
      .eq('id', req.params.id)
      .single()

    if (error) return res.status(404).json({ error: 'Profile not found' })
    res.json(data)
  } catch (err) { next(err) }
})

// POST /api/profiles — create a profile (called after Supabase Auth sign-up)
router.post('/', async (req, res, next) => {
  try {
    const { id, display_name, bio, age, gender, favorite_artists, favorite_genres, has_ride, photo_url } = req.body

    if (!id || !display_name || !age || !gender) {
      return res.status(400).json({ error: 'id, display_name, age, and gender are required' })
    }
    if (age < 18 || age > 100) {
      return res.status(400).json({ error: 'age must be between 18 and 100' })
    }
    const VALID_GENDERS = ['man', 'woman', 'non-binary', 'prefer not to say']
    if (!VALID_GENDERS.includes(gender)) {
      return res.status(400).json({ error: `gender must be one of: ${VALID_GENDERS.join(', ')}` })
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({ id, display_name, bio, age, gender, favorite_artists, favorite_genres, has_ride: has_ride ?? false, photo_url })
      .select()
      .single()

    if (error) return next(error)
    res.status(201).json(data)
  } catch (err) { next(err) }
})

// PATCH /api/profiles/:id — update a profile
router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['display_name', 'bio', 'age', 'gender', 'favorite_artists', 'favorite_genres', 'has_ride', 'photo_url']
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    )

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) return res.status(404).json({ error: 'Profile not found' })
    res.json(data)
  } catch (err) { next(err) }
})

export default router
