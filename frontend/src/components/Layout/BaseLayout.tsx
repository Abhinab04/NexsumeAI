import Footer from "../Footer/Footer";
import AppNavbar from "../Navbar/Nav";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full z-10">
      <AppNavbar />
      {children}
      <Footer />
    </div>
  );
}
