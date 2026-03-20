import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-semibold text-lg">
            Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/admin" className="hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/admin/import" className="hover:text-gray-900">
              Import CSV
            </Link>
          </nav>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          &larr; Back to site
        </Link>
      </header>
      <main className="px-8 py-8 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
