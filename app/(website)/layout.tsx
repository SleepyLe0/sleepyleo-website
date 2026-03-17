// app/(website)/layout.tsx
export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <main id="main-content">{children}</main>;
}
