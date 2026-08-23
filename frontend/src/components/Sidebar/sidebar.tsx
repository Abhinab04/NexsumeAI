import React, {
  useState,
  createContext,
  useContext,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

import {
  Link,
} from "react-router-dom";

import { cn } from "../../lib/utils";


/* ===================================================== */
/* TYPES */
/* ===================================================== */

interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  animate: boolean;
}


/* ===================================================== */
/* SIDEBAR CONTEXT */
/* ===================================================== */

const SidebarContext =
  createContext<
    SidebarContextProps | undefined
  >(undefined);


/* ===================================================== */
/* SIDEBAR HOOK */
/* ===================================================== */

/* eslint-disable react-refresh/only-export-components */

export const useSidebar = () => {
  const context =
    useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used within a SidebarProvider"
    );
  }

  return context;
};


/* ===================================================== */
/* SIDEBAR PROVIDER */
/* ===================================================== */

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  animate?: boolean;
}) => {

  const [
    openState,
    setOpenState,
  ] = useState(false);

  const open =
    openProp !== undefined
      ? openProp
      : openState;

  const setOpen =
    setOpenProp !== undefined
      ? setOpenProp
      : setOpenState;

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        animate,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};


/* ===================================================== */
/* SIDEBAR */
/* ===================================================== */

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  animate?: boolean;
}) => {

  return (
    <SidebarProvider
      open={open}
      setOpen={setOpen}
      animate={animate}
    >
      {children}
    </SidebarProvider>
  );
};


/* ===================================================== */
/* SIDEBAR BODY */
/* ===================================================== */

export const SidebarBody = (
  props: React.ComponentProps<
    typeof motion.div
  >
) => {

  return (
    <>
      <DesktopSidebar {...props} />

      <MobileSidebar
        {...(props as React.ComponentProps<"div">)}
      />
    </>
  );
};


/* ===================================================== */
/* DESKTOP SIDEBAR */
/* ===================================================== */

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<
  typeof motion.div
>) => {

  const {
    open,
    setOpen,
    animate,
  } = useSidebar();

  return (
    <motion.div
      className={cn(
        `
        h-full
        px-4
        py-4
        hidden
        md:flex
        md:flex-col
        bg-black
        border-r
        border-neutral-900
        w-[300px]
        shrink-0
        `,
        className
      )}

      animate={{
        width: animate
          ? open
            ? "300px"
            : "60px"
          : "300px",
      }}

      transition={{
        duration: 0.2,
      }}

      onMouseEnter={() =>
        setOpen(true)
      }

      onMouseLeave={() =>
        setOpen(false)
      }

      {...props}
    >
      {children}
    </motion.div>
  );
};


/* ===================================================== */
/* MOBILE SIDEBAR */
/* ===================================================== */

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {

  const {
    open,
    setOpen,
  } = useSidebar();

  return (
    <div
      className={cn(
        `
        h-12
        px-4
        py-3
        flex
        flex-row
        md:hidden
        items-center
        justify-between
        bg-black
        border-b
        border-neutral-900
        w-full
        `,
        className
      )}

      {...props}
    >

      {/* MENU BUTTON */}

      <div className="flex justify-end z-20 w-full">

        <button
          type="button"
          aria-label="Open menu"
          onClick={() =>
            setOpen(true)
          }
          className="
            text-neutral-300
            hover:text-white
            transition
          "
        >
          <IconMenu2 />
        </button>

      </div>


      {/* MOBILE MENU */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              x: "-100%",
              opacity: 0,
            }}

            animate={{
              x: 0,
              opacity: 1,
            }}

            exit={{
              x: "-100%",
              opacity: 0,
            }}

            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}

            className="
              fixed
              h-full
              w-full
              inset-0
              bg-black
              p-10
              z-[100]
              flex
              flex-col
              justify-between
            "
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              aria-label="Close menu"
              className="
                absolute
                right-10
                top-10
                z-50
                text-neutral-300
                hover:text-white
              "

              onClick={() =>
                setOpen(false)
              }
            >
              <IconX />
            </button>


            {children}

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};


/* ===================================================== */
/* SIDEBAR LINK */
/* ===================================================== */

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {

  const {
    open,
    animate,
  } = useSidebar();

  return (

    <Link
      to={link.href}

      className={cn(
        `
        flex
        items-center
        justify-start
        gap-3
        group/sidebar
        py-2.5
        px-2
        rounded-lg
        text-neutral-400
        hover:text-white
        hover:bg-neutral-900
        transition
        duration-200
        `,
        className
      )}

      {...props}
    >

      {/* ICON */}

      <span className="shrink-0">
        {link.icon}
      </span>


      {/* LABEL */}

      <motion.span
        animate={{
          display: animate
            ? open
              ? "inline-block"
              : "none"
            : "inline-block",

          opacity: animate
            ? open
              ? 1
              : 0
            : 1,
        }}

        className="
          text-neutral-300
          group-hover/sidebar:text-white
          text-sm
          transition
          duration-150
          whitespace-pre
          !p-0
          !m-0
        "
      >
        {link.label}
      </motion.span>

    </Link>

  );
};