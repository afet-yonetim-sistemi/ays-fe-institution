export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <div className="scrollbar-gutter-stable h-screen overflow-auto">
      {children}
    </div>
  )
}
