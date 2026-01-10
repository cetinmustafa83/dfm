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
    // Log the error to an error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: 0, color: '#dc2626' }}>
        500
      </h1>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
        Something went wrong!
      </h2>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', maxWidth: '500px' }}>
        An unexpected error occurred. Please try again later.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '12px 24px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
      <a
        href="/"
        style={{
          marginTop: '16px',
          display: 'inline-block',
          padding: '12px 24px',
          border: '1px solid #000',
          borderRadius: '4px',
          fontSize: '16px',
          textDecoration: 'none',
          color: '#000'
        }}
      >
        Go Home
      </a>
    </div>
  )
}
