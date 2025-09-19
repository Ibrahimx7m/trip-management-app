import { NextRequest, NextResponse } from 'next/server'

// Mock users database
const users = [
  {
    id: '1',
    email: 'admin@nukhbat-naql.sa',
    name: 'مدير النظام',
    role: 'admin',
    password: 'admin123',
    permissions: ['manage_users', 'manage_orders', 'manage_vehicles', 'view_analytics']
  },
  {
    id: '2',
    email: 'client@nukhbat-naql.sa',
    name: 'أحمد محمد العلي',
    role: 'client',
    password: 'client123',
    permissions: ['create_orders', 'track_orders', 'view_history']
  },
  {
    id: '3',
    email: 'driver@nukhbat-naql.sa',
    name: 'محمد عبدالله السعد',
    role: 'driver',
    password: 'driver123',
    permissions: ['view_assigned_orders', 'update_order_status']
  },
  {
    id: '4',
    email: 'operator@nukhbat-naql.sa',
    name: 'سارة أحمد الخالد',
    role: 'operator',
    password: 'operator123',
    permissions: ['manage_orders', 'assign_drivers', 'track_vehicles']
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني غير مسجل' },
        { status: 401 }
      )
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'تم تسجيل الدخول بنجاح'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
