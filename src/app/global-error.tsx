'use client'

// Global error boundary for Next.js 15 App Router
// This file MUST include <html> and <body> tags as it's rendered outside the layout hierarchy
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '20px',
                    margin: 0
                }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>500</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Something went wrong!</p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
