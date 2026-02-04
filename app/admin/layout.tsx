export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Admin pages don't show the main navbar */}
      {children}
    </>
  );
}
