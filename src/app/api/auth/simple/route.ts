import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simple mock authentication
    if (email === 'admin@nukhbat-naql.sa' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        user: {
          id: '1',
          email: 'admin@nukhbat-naql.sa',
          name: 'مدير النظام',
          role: 'admin'
        }
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
