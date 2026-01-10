import Link from 'next/link'

export default function NotFound() {
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
      <h1 style={{ fontSize: '72px', fontWeight: 'bold', margin: 0, color: '#000' }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', maxWidth: '500px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 24px',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      >
        Go Home
      </Link>
    </div>
  )
}
