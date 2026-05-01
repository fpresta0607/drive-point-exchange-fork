import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-7xl font-bold text-dpe-navy mb-4 font-heading">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-950 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-950 text-slate-950 font-semibold hover:bg-slate-950 hover:text-white transition-colors"
          >
            View Services
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 font-semibold hover:border-slate-950 hover:text-slate-950 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
