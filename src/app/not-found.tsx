export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
          <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Page Not Found</p>
          <a href="/" style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '1.1rem'
          }}>
            Go back home
          </a>
        </div>
      </body>
    </html>
  )
}
