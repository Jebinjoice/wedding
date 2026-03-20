import "./globals.css";

export const metadata = {
  title: "Jebin & Lenah — Wedding Invitation",
  description: "April 11–12, 2026 · Kochi, Kerala",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}