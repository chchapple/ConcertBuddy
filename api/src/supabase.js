import { createClient } from '@supabase/supabase-js'

let _client = null

function getClient() {
  if (!_client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !url.startsWith('http') || !key || key.startsWith('PASTE')) {
      throw new Error('Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in api/.env')
    }
    _client = createClient(url, key)
  }
  return _client
}

const supabase = new Proxy({}, {
  get(_, prop) {
    return (...args) => getClient()[prop](...args)
  },
})

export default supabase
