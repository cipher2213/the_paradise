"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
  ShoppingBagIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (href?.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <li>
      <a
        href={href || "#"}
        onClick={handleClick}
        className="flex items-center gap-2 font-medium cursor-pointer text-inherit"
      >
        {children}
      </a>
    </li>
  );
}

const NAV_MENU = [
  { name: "About", icon: UserCircleIcon, href: "/#about" },
  { name: "Menu", icon: ShoppingBagIcon, href: "/menu-page" },
  { name: "Contact", icon: PhoneIcon, href: "/#contact" },
  { name: "Order History", icon: ClockIcon, href: "/order-history" },
];

export function Navbar() {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpen = () => setOpen((cur) => !cur);

  if (!mounted || pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className={`fixed top-0 z-50 w-full ${
        isScrolling ? "bg-white text-gray-900" : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold">
            Paradise Cafe
          </Link>

          <ul className="hidden lg:flex items-center gap-6">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </NavItem>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            {!session ? (
              <>
                <button
                  onClick={() => signIn("google")}
                  className="px-4 py-2 text-sm font-medium"
                >
                  Sign In with Google
                </button>
                <Link
                  href="/admin/signin"
                  className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="user"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button onClick={handleOpen} className="lg:hidden">
            {open ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {open && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_MENU.map(({ name, icon: Icon, href }) => (
                <NavItem key={name} href={href}>
                  <Icon className="h-5 w-5" />
                  {name}
                </NavItem>
              ))}

              {!session ? (
                <>
                  <button
                    onClick={() => signIn("google")}
                    className="block w-full text-left px-3 py-2"
                  >
                    Sign In with Google
                  </button>
                  <Link
                    href="/admin/signin"
                    className="block w-full text-left px-3 py-2"
                  >
                    Admin Login
                  </Link>
                </>
              ) : (
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    {session.user?.image && (
                      <img
                        src={session.user.image}
                        alt="user"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span>{session.user?.name}</span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-3 py-2"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;