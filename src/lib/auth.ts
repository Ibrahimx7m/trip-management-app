// Enhanced authentication system for Nukhbat Al-Naql
import CredentialsProvider from 'next-auth/providers/credentials';

// Define NextAuthOptions type locally to avoid import issues
interface NextAuthOptions {
  providers: any[];
  callbacks?: any;
  pages?: any;
  session?: any;
  secret?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'driver' | 'operator';
  avatar?: string;
  phone?: string;
  permissions: string[];
}

// Mock users database - In production, this would be replaced with a real database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@nukhbat-naql.sa',
    name: 'مدير النظام',
    role: 'admin',
    avatar: '/avatars/admin.png',
    phone: '+966501234567',
    permissions: [
      'manage_users',
      'manage_orders',
      'manage_vehicles',
      'manage_drivers',
      'view_analytics',
      'manage_settings',
      'send_notifications'
    ]
  },
  {
    id: '2',
    email: 'client@nukhbat-naql.sa',
    name: 'أحمد محمد العلي',
    role: 'client',
    avatar: '/avatars/client.png',
    phone: '+966509876543',
    permissions: [
      'create_orders',
      'track_orders',
      'view_history',
      'contact_support'
    ]
  },
  {
    id: '3',
    email: 'driver@nukhbat-naql.sa',
    name: 'محمد عبدالله السعد',
    role: 'driver',
    avatar: '/avatars/driver.png',
    phone: '+966505555555',
    permissions: [
      'view_assigned_orders',
      'update_order_status',
      'update_location',
      'contact_support'
    ]
  },
  {
    id: '4',
    email: 'operator@nukhbat-naql.sa',
    name: 'سارة أحمد الخالد',
    role: 'operator',
    avatar: '/avatars/operator.png',
    phone: '+966507777777',
    permissions: [
      'manage_orders',
      'assign_drivers',
      'track_vehicles',
      'handle_support',
      'send_notifications'
    ]
  }
];

// Mock passwords - In production, these would be hashed
const mockPasswords: Record<string, string> = {
  'admin@nukhbat-naql.sa': 'admin123',
  'client@nukhbat-naql.sa': 'client123',
  'driver@nukhbat-naql.sa': 'driver123',
  'operator@nukhbat-naql.sa': 'operator123'
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        // Find user by email
        const user = mockUsers.find(u => u.email === credentials.email);
        if (!user) {
          throw new Error('البريد الإلكتروني غير مسجل');
        }

        // Check password
        const validPassword = mockPasswords[credentials.email as keyof typeof mockPasswords] === credentials.password;
        if (!validPassword) {
          throw new Error('كلمة المرور غير صحيحة');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          permissions: user.permissions
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions;
        token.phone = user.phone;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        session.user.phone = token.phone as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: any; baseUrl: any }) {
      // Redirect based on user role after login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'nukhbat-naql-secret-key'
};

// Helper functions for role-based access control
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasRole = (userRole: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole);
};

export const canAccessRoute = (userRole: string, route: string): boolean => {
  const routePermissions: Record<string, string[]> = {
    '/dashboard': ['admin', 'operator'],
    '/dashboard/driver-management': ['admin', 'operator'],
    '/dashboard/trips-management': ['admin', 'operator'],
    '/dashboard/vehicle-management': ['admin'],
    '/dashboard/reports': ['admin', 'operator'],
    '/vehicles': ['admin', 'operator'],
    '/admin': ['admin'],
    '/clients': ['client'],
    '/driver': ['driver'],
    '/tracking': ['admin', 'operator', 'client', 'driver'],
    '/orders': ['admin', 'operator', 'client']
  };

  const allowedRoles = routePermissions[route];
  if (!allowedRoles) return true; // Public route
  
  return allowedRoles.includes(userRole);
};

// Get redirect URL based on user role
export const getRedirectUrl = (userRole: string): string => {
  switch (userRole) {
    case 'admin':
      return '/dashboard';
    case 'operator':
      return '/dashboard';
    case 'client':
      return '/clients';
    case 'driver':
      return '/driver/dashboard';
    default:
      return '/';
  }
};

// Mock user functions - replace with real database operations
export const getUserById = async (id: string): Promise<User | null> => {
  return mockUsers.find(user => user.id === id) || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return mockUsers.find(user => user.email === email) || null;
};

export const updateUserProfile = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  return mockUsers[userIndex];
};

export const changePassword = async (email: string, newPassword: string): Promise<boolean> => {
  if (mockPasswords[email]) {
    mockPasswords[email] = newPassword;
    return true;
  }
  return false;
};

// Activity logging
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

const activityLogs: ActivityLog[] = [];

export const logActivity = async (
  userId: string,
  action: string,
  details: string,
  ipAddress?: string
): Promise<void> => {
  const log: ActivityLog = {
    id: Date.now().toString(),
    userId,
    action,
    details,
    timestamp: new Date(),
    ipAddress
  };
  
  activityLogs.push(log);
  console.log('Activity logged:', log);
};

export const getUserActivities = async (userId: string, limit: number = 50): Promise<ActivityLog[]> => {
  return activityLogs
    .filter(log => log.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};
