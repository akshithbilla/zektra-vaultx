import React from 'react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <nav className="mt-6 space-y-4">
            <a href="#" className="block text-blue-600 font-medium">Profile</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Account</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Notifications</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Security</a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <form className="space-y-6 max-w-xl">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Settings;
