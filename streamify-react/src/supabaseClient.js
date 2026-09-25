import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jldaptwksseubbrykvnu.supabase.co'
const supabaseKey = 'sb_publishable_VsRhQ733Zy_ugDGKyASYnA_APHniLfZ'

export const supabase = createClient(supabaseUrl, supabaseKey)
