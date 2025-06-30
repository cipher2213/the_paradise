"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  FiHome,
  FiMenu,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/admin/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", icon: FiHome, href: "/admin/dashboard" },
    { label: "Menu", icon: FiMenu, href: "/admin/dashboard/menu" },
    { label: "Users", icon: FiUsers, href: "/admin/dashboard/users" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Admin Panel
          </Typography>
        </div>
        <List>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.href}>
                <ListItem selected={pathname === item.href}>
                  <ListItemPrefix>
                    <Icon className="h-5 w-5" />
                  </ListItemPrefix>
                  {item.label}
                </ListItem>
              </Link>
            );
          })}
          <ListItem
            className="text-red-500 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            onClick={() => {
              // Handle logout
              router.push("/admin/signin");
            }}
          >
            <ListItemPrefix>
              <FiLogOut className="h-5 w-5" />
            </ListItemPrefix>
            Logout
          </ListItem>
        </List>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 