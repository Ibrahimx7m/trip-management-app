'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-md text-center bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          حدث خطأ ما!
        </h2>
        <p className="text-gray-600 mb-6">
          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-md transition"
        >
          المحاولة مرة أخرى
        </button>
      </div>
    </div>
  )
}
