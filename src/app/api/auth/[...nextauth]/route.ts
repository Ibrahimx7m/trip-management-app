import NextAuth from 'next-auth'

const handler = NextAuth({
  providers: [],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
