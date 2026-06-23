import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <p className="not-found-code">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>

      <Link className="button button-primary" to="/">
        Go to Dashboard
      </Link>
    </div>
  );
}