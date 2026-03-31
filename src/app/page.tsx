// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'
import { useAuth } from "@/src/contexts/AuthContext"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [ user, loading, router ])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl animate-pulse" />
          <Loader2 className="relative w-16 h-16 text-white animate-spin p-3" />
        </div>
        <p className="text-gray-600">Loading InventoryHub...</p>
      </div>
    </div>
  )
}
