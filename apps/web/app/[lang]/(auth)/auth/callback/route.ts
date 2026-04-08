import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { useParams } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/en/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const lang = next.split('/')[1] || 'en'
      return NextResponse.redirect(`${origin}/${lang}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/en/login?error=auth_callback_error`)
}