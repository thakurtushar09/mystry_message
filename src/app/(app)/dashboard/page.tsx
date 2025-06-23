'use client'

import { useSession } from 'next-auth/react'
import Redirecting from '@/app/(auth)/Redirecting'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const { status } = useSession()

  if (status === 'loading') {
    return <Redirecting />
  }

  if (status === 'unauthenticated') {
    return <Redirecting />
  }

  return (
    <div>
        <Navbar/>
      <h1>Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  )
}