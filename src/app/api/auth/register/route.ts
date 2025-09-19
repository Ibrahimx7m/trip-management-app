import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // In a real app, you would save to database
    // For now, we'll just return success
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'client',
      permissions: ['create_orders', 'track_orders', 'view_history']
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'تم إنشاء الحساب بنجاح'
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
