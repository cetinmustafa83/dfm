export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            DFM Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Digital Project Management & Licensing Platform
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're building a comprehensive platform with advanced features including:
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li>• Project Management Dashboard</li>
              <li>• License Tracking System</li>
              <li>• AI-Powered SEO Tools</li>
              <li>• PWA Offline Support</li>
              <li>• Real-time Notifications</li>
              <li>• Advanced Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}