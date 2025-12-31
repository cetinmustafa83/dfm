export default function RootNotFound() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0;url=/en" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `window.location.href = '/en'`
        }} />
      </body>
    </html>
  )
}
