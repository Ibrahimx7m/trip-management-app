import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-md text-center bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
          404 - الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 mb-6">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link href="/" className="inline-block px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
