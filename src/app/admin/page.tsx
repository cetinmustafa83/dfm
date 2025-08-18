export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400">Welcome to your custom content management system.</p>
      {/* Placeholder for recent changes, basic analytics, etc. */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Content Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage pages, services, and job postings.</p>
          <ul className="list-disc list-inside mt-4 text-gray-600 dark:text-gray-400">
            <li>Pages: 0</li>
            <li>Services: 0</li>
            <li>Jobs: 0</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Media Library</h2>
          <p className="text-gray-600 dark:text-gray-400">Upload and organize your site&apos;s images.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Go to Media</button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Site Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure global site information and SEO defaults.</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Edit Settings</button>
        </div>
      </div>
    </div>
  );
}