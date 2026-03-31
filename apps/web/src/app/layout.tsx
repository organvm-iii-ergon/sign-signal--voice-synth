import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign Signal — Speech Score Engine",
  description: "Dialogue Looping Tracker Sequence — Write, sequence, and hear your dialogue as performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Sign Signal</h1>
            <nav className="flex gap-4">
              <a href="/scenes" className="text-gray-600 hover:text-gray-900">Scenes</a>
              <a href="/voices" className="text-gray-600 hover:text-gray-900">Voices</a>
              <a href="/settings" className="text-gray-600 hover:text-gray-900">Settings</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}