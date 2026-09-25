const supabaseUrl = 'https://jldaptwksseubbrykvnu.supabase.co';
const supabaseKey = 'sb_publishable_VsRhQ733Zy_ugDGKyASYnA_APHniLfZ';

// Create a single supabase client for interacting with your database
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
