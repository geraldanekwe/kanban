"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export function NavBar() {
  const pathname = usePathname();

  const links = [
    { name: "Kanban", href: "/", icon: Squares2X2Icon },
    { name: "Backlog", href: "/backlog", icon: ClipboardDocumentListIcon },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="h-16 flex items-center justify-center">
        <div className="flex space-x-10">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{link.name}</span>
                {isActive && (
                  <span className="w-full h-[2px] bg-blue-600 mt-1 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
