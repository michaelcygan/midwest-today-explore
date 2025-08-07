export const metadata = {
  title: "Midwest Today — Explore Today",
  description: "Plan a perfect day in any Midwest city or neighborhood.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}