import { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconFileText,
  IconHistory,
  IconMail,
  IconBriefcase,
  IconMicrophone,
  IconMap,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { UserButton, useClerk } from "@clerk/clerk-react";

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../Sidebar/sidebar";

export function DashboardLayout() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      // Your backend should also revoke the JWT.
      // If you are not using Clerk for authentication,
      // simply navigate after calling your logout API.

      await signOut().catch(() => {
        // Ignore Clerk logout errors if Clerk isn't
        // being used as the primary authentication system.
      });

      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/signin");
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler
          className="h-5 w-5 shrink-0 text-neutral-400"
        />
      ),
    },
    {
      label: "Resume Editor",
      href: "/editor",
      icon: (
        <IconFileText
          className="h-5 w-5 shrink-0 text-neutral-400"
        />
      ),
    },
    {
      label: "Resume History",
      href: "/resume-history",
      icon: (
        <IconHistory
          className="h-5 w-5 shrink-0 text-neutral-400"
        />
      ),
    },
    {
      label: "Cover Letter",
      href: "/cover-letter",
      icon: (
        <IconMail
          className="h-5 w-5 shrink-0 text-neutral-400"
        />
      ),
    },
    {
      label: "Job Tracker",
      href: "/job-tracker",
      icon: (
        <IconBriefcase
          className="h-5 w-5 shrink-0 text-neutral-400"
        />
      ),
    },
    {
      label: "Mock Interview",
      href: "/mock-interview",
      icon: (
        <IconMicrophone
          className="h-5 w-5 shrink-0 text-neutral-400"
        />
      ),
    },
    {
      label: "Skill Roadmap",
      href: "/skill-roadmap",
      icon: (
        <IconMap
          className="h-5 w-5 shrink-0 text-neutral-400"
        />
      ),
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">

      {/* SIDEBAR */}

      <Sidebar
        open={open}
        setOpen={setOpen}
      >
        <SidebarBody
          className="
            !h-screen
            !bg-black
            border-r
            border-neutral-900
          "
        >
          <div className="flex h-full flex-1 flex-col">

            {/* TOP */}

            <div>
              <div className="mb-10">
                {open ? <Logo /> : <LogoIcon />}
              </div>

              <nav className="flex flex-col gap-2">
                {links.map((link) => (
                  <SidebarLink
                    key={link.href}
                    link={link}
                  />
                ))}
              </nav>
            </div>

            {/* BOTTOM */}

            <div className="mt-auto">

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-3
                  text-neutral-400
                  transition
                  hover:bg-neutral-900
                  hover:text-white
                "
              >
                <IconArrowLeft className="h-5 w-5 shrink-0" />

                {open && (
                  <span className="text-sm">
                    Logout
                  </span>
                )}
              </button>

              <div
                className="
                  mt-4
                  border-t
                  border-neutral-900
                  pt-4
                "
              >
                <div className="flex items-center gap-3">

                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox:
                          "h-8 w-8",
                      },
                    }}
                  />

                  {open && (
                    <span className="text-sm text-neutral-400">
                      Account
                    </span>
                  )}

                </div>
              </div>

            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* MAIN */}

      <main
        className="
          min-w-0
          min-h-screen
          flex-1
          overflow-x-hidden
          overflow-y-auto
          bg-black
        "
      >
        <div className="min-h-screen w-full bg-black">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

/* ===================================================== */
/* LOGO */
/* ===================================================== */

export const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="
        relative
        z-20
        flex
        items-center
        gap-3
        py-1
        text-white
      "
    >
      <div
        className="
          h-7
          w-7
          shrink-0
          rounded-tl-lg
          rounded-tr-sm
          rounded-br-lg
          rounded-bl-sm
          bg-white
        "
      />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          text-2xl
          font-bold
          whitespace-nowrap
          text-white
        "
      >
        Nexsume
        <span className="text-indigo-500">
          .ai
        </span>
      </motion.span>
    </Link>
  );
};

/* ===================================================== */
/* COLLAPSED LOGO */
/* ===================================================== */

export const LogoIcon = () => {
  return (
    <Link
      to="/dashboard"
      className="
        relative
        z-20
        flex
        items-center
        py-1
      "
    >
      <div
        className="
          h-7
          w-7
          shrink-0
          rounded-tl-lg
          rounded-tr-sm
          rounded-br-lg
          rounded-bl-sm
          bg-white
        "
      />
    </Link>
  );
};
