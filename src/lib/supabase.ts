import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yicnuqeeywyervqtcps.supabase.co';
const supabaseKey = 'sb_publishable_yZTlklKgLRqRprr7GAgI5Q_WIjXhFUr';

export const supabase = createClient(supabaseUrl, supabaseKey);
