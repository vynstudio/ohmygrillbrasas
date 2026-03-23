import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://howkzkjipkrwnwxcavj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hlDAmNj2DlqEcqKyONugDQ_wGxEhI5u';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
