export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  return (
    <div className="scrollbar-gutter-stable h-screen overflow-auto">
      {children}
    </div>
  )
}
