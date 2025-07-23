// src/pages/PageNotFound.jsx
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-3xl mb-4">Page Not Found</h2>
      <p className="mb-8">Sorry, the page you are looking for doesn't exist.</p>
      <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Go Back Home
      </Link>
    </div>
  );
}

export default PageNotFound;
