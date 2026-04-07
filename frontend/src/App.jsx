import React from 'react'
import '../styles/App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Danaco Frozen Food E-Commerce
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
            <p className="text-gray-600">
              Frontend initialization complete. Backend setup instructions below.
            </p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Start PostgreSQL: <code className="bg-gray-100 px-2 py-1 rounded">docker-compose up -d</code></li>
                <li>Build backend: <code className="bg-gray-100 px-2 py-1 rounded">cd backend/danaco && mvn clean install</code></li>
                <li>Run backend: <code className="bg-gray-100 px-2 py-1 rounded">mvn spring-boot:run</code></li>
                <li>API docs: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8080/swagger-ui.html</code></li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
