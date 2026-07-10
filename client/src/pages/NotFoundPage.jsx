import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 text-center px-4">
    <h1 className="text-6xl font-bold text-primary-500">404</h1>
    <p className="text-lg text-slate-600 dark:text-slate-300">Looks like this page took a wrong turn.</p>
    <Link to="/" className="btn-primary">
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
