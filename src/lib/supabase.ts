import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para gerar código de projeto
export async function generateProjectCode(profileId: string): Promise<string> {
  const { data, error } = await supabase
    .from('projects')
    .select('codigo')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || !data || data.length === 0) {
    return 'PRJ-0001'
  }

  const lastCode = data[0].codigo
  const number = parseInt(lastCode.split('-')[1]) + 1
  return `PRJ-${number.toString().padStart(4, '0')}`
}
