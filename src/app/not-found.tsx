export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
          <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Page Not Found</p>
          <a
            href="/en"
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            Go to Homepage
          </a>
        </div>
      </body>
    </html>
  )
}
