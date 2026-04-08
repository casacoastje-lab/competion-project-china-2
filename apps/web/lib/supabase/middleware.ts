import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtectedRoute = pathname.includes('/dashboard') || 
                          pathname.includes('/blogger') || 
                          pathname.includes('/admin') ||
                          pathname.includes('/settings') || 
                          pathname.includes('/bookmarks')

  const isAuthRoute = pathname.includes('/login') || 
                     pathname.includes('/register') || 
                     pathname.includes('/forgot-password')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    const lang = pathname.split('/')[1] || 'en'
    url.pathname = `/${lang}/login`
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    const lang = pathname.split('/')[1] || 'en'
    url.pathname = `/${lang}/dashboard`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
