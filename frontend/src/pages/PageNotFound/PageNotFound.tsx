import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh text-center space-y-6">
      <h1 className="text-6xl font-extrabold text-white">404</h1>
      <p className="text-xl font-medium text-white">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
