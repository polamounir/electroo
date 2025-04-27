import { Link } from "react-router-dom";

export default function ErrorPage({ error }) {
  return (
    <div>
      <div className="flex justify-center items-center min-h-[90svh] pb-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Error</h1>
          <p className="text-gray-500">{error}</p>
          <p className="text-gray-500">
            Please try again later or <span className="text-teal-500">
                <Link to="/contact">contact support.</Link>
            </span>
          </p>
          
          <Link to="/" className="text-teal-500">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
