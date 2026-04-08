import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const isProtectedRoute = pathname.startsWith('/en/dashboard') || 
                          pathname.startsWith('/zh/dashboard') ||
                          pathname.startsWith('/en/blogger') || 
                          pathname.startsWith('/zh/blogger') ||
                          pathname.startsWith('/en/admin') || 
                          pathname.startsWith('/zh/admin') ||
                          pathname.startsWith('/en/settings') || 
                          pathname.startsWith('/zh/settings') ||
                          pathname.startsWith('/en/bookmarks') || 
                          pathname.startsWith('/zh/bookmarks')

  const isAuthRoute = pathname.startsWith('/en/login') || 
                     pathname.startsWith('/zh/login') ||
                     pathname.startsWith('/en/register') || 
                     pathname.startsWith('/zh/register') ||
                     pathname.startsWith('/en/forgot-password') || 
                     pathname.startsWith('/zh/forgot-password')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    const lang = pathname.split('/')[1]
    url.pathname = `/${lang}/login`
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    const lang = pathname.split('/')[1]
    url.pathname = `/${lang}/dashboard`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}