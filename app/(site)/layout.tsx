import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// Full-site chrome for the public pages (/ and /about). The embed routes
// (/assistant, /onboarding) live outside this group and render without it.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
