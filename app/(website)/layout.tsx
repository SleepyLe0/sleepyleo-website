import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}
