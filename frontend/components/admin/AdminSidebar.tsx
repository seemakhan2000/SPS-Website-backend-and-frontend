
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  ShieldCheck,
  Cloud,
  Bot,
  Users,
  Server,
  Briefcase,
  Package,
  MessageSquare,
  Workflow,
  CloudUpload,
  ListChecks,
  Newspaper,
  Cpu,
} from "@/lib/icons";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: ShieldCheck,
  },
  {
    name: "Hero Section",
    href: "/admin?section=hero",
    icon: Cloud,
    section: "hero",
  },
  {
    name: "About Us",
    href: "/admin?section=about",
    icon: Users,
    section: "about",
  },
  {
    name: "Services Overview",
    href: "/admin?section=services",
    icon: Server,
    section: "services",
  },
  {
    name: "Startups",
    href: "/admin?section=startups",
    icon: Bot,
    section: "startups",
  },
  {
    name: "Products",
    href: "/admin?section=products",
    icon: Package,
    section: "products",
  },
  {
    name: "CTA Content",
    href: "/admin?section=ctaContent",
    icon: MessageSquare,
    section: "ctaContent",
  },
  {
    name: "Customers",
    href: "/admin?section=customers",
    icon: Users,
    section: "customers",
  },
  {
    name: "How It Works",
    href: "/admin?section=howitworks",
    icon: Workflow,
    section: "howitworks",
  },
  {
    name: "Technology Partners",
    href: "/admin?section=technologyPartners",
    icon: Cpu,
    section: "technologyPartners",
  },
  {
    name: "Highlights",
    href: "/admin?section=highlights",
    icon: ListChecks,
    section: "highlights",
  },
  {
    name: "Customers Marquee",
    href: "/admin?section=clients",
    icon: CloudUpload,
    section: "clients",
  },
  {
    name: "News & Insights",
    href: "/admin?section=news",
    icon: Newspaper,
    section: "news",
  },
  {
    name: "Verticals Overview",
    href: "/admin?section=verticals",
    icon: Briefcase,
    section: "verticals",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSection = searchParams.get("section");

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] bg-[#1c184e] text-white">

      {/* Sidebar Header */}
      <div className="border-b border-white/10 px-5 py-5">
        <h1 className="text-lg font-bold">
          SPS Enterprise
        </h1>

        <p className="mt-0.5 text-[11px] text-white/50">
          Administration Panel
        </p>
      </div>

      {/* Sidebar Menu */}
      <nav className="px-3 py-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = item.section
            ? pathname === "/admin" &&
            currentSection === item.section
            : pathname === "/admin" &&
            !currentSection;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${active
                  ? "bg-[#2a5ab5] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              {/* ICON */}
              <Icon
                size={17}
                className="shrink-0"
              />

              {/* TEXT */}
              <span>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

