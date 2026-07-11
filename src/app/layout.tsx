import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyFlat - Flat Rental Platform",
  description: "Find your perfect flat with MyFlat - A platform for brokers, owners, and tenants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  try {
                    const storedTheme = localStorage.getItem('theme');
                    if (storedTheme) {
                      return storedTheme;
                    }
                    // Default to light theme if nothing is stored or preferred
                    return 'light';
                  } catch (e) {
                    // localStorage might not be available
                    return 'light';
                  }
                }
                const theme = getInitialTheme();
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  // No need to explicitly remove for initial, as it won't be there
                  // document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
