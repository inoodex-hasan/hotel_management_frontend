import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div>
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}