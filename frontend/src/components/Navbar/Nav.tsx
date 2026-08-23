import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./resizable-navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";

export default function AppNavbar() {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
  };

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <NavbarButton variant="destructive" onClick={handleLogout}>
              Log Out
            </NavbarButton>
          ) : (
            <NavbarButton
              variant="secondary"
              onClick={() => navigate("/signin")}
            >
              Login
            </NavbarButton>
          )}

          {isSignedIn && (
            <NavbarButton
              variant="primary"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </NavbarButton>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            {isSignedIn ? (
              <NavbarButton variant="destructive" onClick={handleLogout}>
                Log Out
              </NavbarButton>
            ) : (
              <NavbarButton
                variant="secondary"
                onClick={() => navigate("/signin")}
              >
                Login
              </NavbarButton>
            )}

            {isSignedIn && (
              <NavbarButton
                variant="primary"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </NavbarButton>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
