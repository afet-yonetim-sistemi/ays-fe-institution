export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <div className="overflow-auto scrollbar-gutter-stable h-screen">
      {children}
    </div>
  )
}
