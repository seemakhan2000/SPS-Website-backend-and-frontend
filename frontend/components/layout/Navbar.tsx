"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { NavItem } from "@/data/navigation";
import Image from "next/image";

interface NavbarProps {
  items: NavItem[];
  pathname: string;
  isScrolled: boolean;
  isHomePage?: boolean;
}

export default function Navbar({
  items,
  pathname,
  isScrolled,
  isHomePage = false,
}: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    if (href === "#") return false;
    return pathname.startsWith(href);
  };

  const handleMouseEnter = (href: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(href);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredItem(null);
    }, 150);
  };

  const handleItemMouseEnter = (id: string) => {
    setHoveredItem(id);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubmenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="flex lg:hidden w-full items-center justify-between px-[10px]">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logowhitenew-480.webp"
            alt="SPS Logo"
            width={160}
            height={50}
            priority
            className="h-auto w-[140px] object-contain"
          />
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10"
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
              <span className="text-lg font-bold text-gray-900">Menu</span>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-3 py-3">
              {items.map((item) => {
                const hasChildren = !!item.children?.length;
                const itemKey = item.id || item.href;
                const isSubmenuOpen = openMobileSubmenu === itemKey;

                return (
                  <div
                    key={itemKey}
                    className="border-b border-gray-100 last:border-0"
                  >
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() =>
                            setOpenMobileSubmenu(
                              isSubmenuOpen ? null : itemKey
                            )
                          }
                          className="flex w-full items-center justify-between px-2 py-3 text-base font-medium text-gray-800 transition-colors hover:text-blue-600"
                        >
                          {item.name}

                          <svg
                            className={`h-4 w-4 text-gray-400 transition-transform ${
                              isSubmenuOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {isSubmenuOpen && (
                          <div className="space-y-1 pb-3 pl-4">
                            {item.children!.map((child) => {
                              const childHasChildren = !!child.children?.length;

                              if (childHasChildren) {
                                return (
                                  <div
                                    key={child.id || child.href}
                                    className="mt-2 first:mt-0"
                                  >
                                    <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                                      {child.name}
                                    </div>

                                    {child.children!.map((g) => (
                                      <Link
                                        key={g.id || g.href}
                                        href={g.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block rounded px-2 py-2 text-sm transition-colors ${
                                          pathname === g.href
                                            ? "bg-blue-50 font-medium text-blue-600"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                      >
                                        {g.name}
                                      </Link>
                                    ))}
                                  </div>
                                );
                              }

                              return (
                                <Link
                                  key={child.id || child.href}
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`block rounded px-2 py-2 text-sm transition-colors ${
                                    pathname === child.href
                                      ? "bg-blue-50 font-medium text-blue-600"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {child.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-2 py-3 text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-blue-600"
                            : "text-gray-800 hover:text-blue-600"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="px-3 pb-5">
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-md bg-[#0a1628] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1a2a40]"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden h-full w-full min-w-0 items-center px-[45px] lg:flex">
        {/* LOGO (left) */}
        <Link href="/" className="mr-6 flex shrink-0 items-center xl:mr-10">
          <Image
            src="/images/logowhitenew-480.webp"
            alt="SPS Logo"
            width={200}
            height={60}
            priority
          className="h-auto w-[190px] object-contain xl:w-[230px] 2xl:w-[260px]"
          />
        </Link>

        {/* NAV ITEMS (centered, equal rhythm) */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-x-4 xl:gap-x-6 2xl:gap-x-8">
          {items.map((item) => {
            const hasChildren = !!item.children?.length;
            const isItemActive = isActive(item.href);
            const isDropdownOpen = activeDropdown === item.href;
            const isMegaMenu = ["Products", "Services", "Verticals"].includes(
              item.name
            );

            const linkClasses = `relative inline-flex h-20 items-center whitespace-nowrap text-[13px] font-medium tracking-[0.01em] transition-colors duration-200 xl:text-[14px] 2xl:text-[15px] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:scale-x-100 ${
              isItemActive || isDropdownOpen
                ? "text-white after:scale-x-100"
                : "text-white/80 hover:text-white"
            }`;

            return (
              <div
                key={item.id || item.href}
                className="relative shrink-0"
                onMouseEnter={() => hasChildren && handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
              >
                {hasChildren ? (
                  <>
                    <button type="button" className={linkClasses}>
                      {item.name}
                      <svg
                        className={`ml-1 h-3 w-3 shrink-0 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isDropdownOpen &&
                      (isMegaMenu ? (
                        <MegaMenu
                          parentName={item.name}
                          items={item.children!}
                          pathname={pathname}
                        />
                      ) : (
                        <DropdownMenu
                          items={item.children!}
                          pathname={pathname}
                          onItemHover={handleItemMouseEnter}
                          hoveredItem={hoveredItem}
                        />
                      ))}
                  </>
                ) : (
                  <Link href={item.href} className={linkClasses}>
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* ADMIN LOGIN (right) */}
        <Link
          href="/admin/login"
          className="ml-6 inline-flex shrink-0 items-center whitespace-nowrap rounded-md border border-white/40 px-4 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#0a1628] xl:ml-10 xl:text-sm"
        >
          Admin Login
        </Link>
      </nav>
    </>
  );
}

// ============================================================
// MEGA MENU CONFIGURATION
// ============================================================

interface MegaMenuConfig {
  minHeight: number;
  columns: string[][];
  panel: {
    image?: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

const MEGA_MENU_CONFIG: Record<string, MegaMenuConfig> = {
  Products: {
    minHeight: 380,
    columns: [["SPS"], ["IBM"], ["Others"]],
    panel: {
      image: "/images/ab2.webp",
      description:
        "SPS empowers enterprises with Cybersecurity, Cloud, AI & Automation solutions designed to scale and secure digital transformation.",
      buttonLabel: "View All Products",
      buttonHref: "/products",
    },
  },

  Services: {
    minHeight: 460,
    columns: [
      ["Cybersecurity", "Training"],
      ["Cloud"],
      ["AI & Automation"],
      ["Collaboration"],
    ],
    panel: {
      image: "/images/ab2.webp",
      description:
        "SPS empowers enterprises with Cybersecurity, Cloud, AI & Automation solutions designed to scale and secure digital transformation.",
      buttonLabel: "Discover More",
      buttonHref: "/services",
    },
  },

  Verticals: {
    minHeight: 520,
    columns: [
      ["Public Sector", "Energy"],
      ["Industrial", "Financial"],
      ["Healthcare", "Telecommunications"],
      ["Retail"],
    ],
    panel: {
      image: "/images/ab2.webp",
      description:
        "Accelerate your county's digital transformation with an executive-led strategy focused on cybersecurity, cloud, and AI.",
      buttonLabel: "Discover More",
      buttonHref: "/verticals",
    },
  },
};

function getItemsByNames(items: NavItem[], names: string[]): NavItem[] {
  return names
    .map((name) => items.find((item) => item.name === name))
    .filter((item): item is NavItem => Boolean(item));
}

// ============================================================
// MEGA MENU
// ============================================================

function MegaMenu({
  parentName,
  items,
  pathname,
}: {
  parentName: string;
  items: NavItem[];
  pathname: string;
}) {
  const config = MEGA_MENU_CONFIG[parentName];

  if (!config) return null;

  const hasImage = config.panel.image;

  return (
    <div
      className="fixed left-0 right-0 top-[80px] z-50 w-screen overflow-y-auto border-t border-gray-200 bg-white shadow-xl"
      style={{
        minHeight: `${config.minHeight}px`,
        maxHeight: `${config.minHeight + 60}px`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      }}
    >
      <div
        className="mx-auto max-w-[1400px] px-4"
        style={{
          display: "grid",
          gridTemplateColumns: `180px repeat(${config.columns.length}, 1fr)`,
          gap: "16px",
          padding: "20px 0",
        }}
      >
        {/* LEFT PANEL */}
        <div className="border-r border-gray-100 pr-2">
          <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg bg-gray-100">
            {hasImage ? (
              <Image
                src={config.panel.image!}
                alt={parentName}
                fill
                className="object-cover"
                sizes="180px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <span className="text-3xl font-bold text-blue-400">
                  {parentName === "Products"
                    ? "🛠️"
                    : parentName === "Services"
                    ? "⚡"
                    : "🏢"}
                </span>
              </div>
            )}
          </div>

          <p className="mb-2 text-sm leading-relaxed text-gray-600">
            {config.panel.description}
          </p>

          <Link
            href={config.panel.buttonHref}
            className="inline-block rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {config.panel.buttonLabel} →
          </Link>
        </div>

        {/* MENU COLUMNS */}
        {config.columns.map((groupNames, colIdx) => {
          const groups = getItemsByNames(items, groupNames);

          return (
            <div key={colIdx} className="flex flex-col gap-4">
              {groups.map((group) => (
                <div key={group.id || group.name}>
                  <div className="mb-2 border-b border-gray-200 pb-2 text-base font-bold text-gray-900">
                    {group.name}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {(group.children || []).map((child) => (
                      <Link
                        key={child.id || child.href}
                        href={child.href}
                        className={`py-0.5 text-base transition-colors ${
                          pathname === child.href
                            ? "font-medium text-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// REGULAR DROPDOWN
// ============================================================

function DropdownMenu({
  items,
  pathname,
  onItemHover,
  hoveredItem,
}: {
  items: NavItem[];
  pathname: string;
  onItemHover: (id: string) => void;
  hoveredItem: string | null;
}) {
  return (
    <div
      className="absolute left-0 top-full z-50 mt-2 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl"
      style={{
        width: "280px",
        minWidth: "280px",
        maxWidth: "280px",
        maxHeight: "420px",
        padding: "10px 0",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      }}
    >
      {items.map((item) => {
        const hasChildren = !!item.children?.length;
        const isActive = pathname === item.href;
        const isHovered = hoveredItem === (item.id || item.href);
        const itemKey = item.id || `item-${item.name}`;

        if (hasChildren && item.isGroup) {
          return (
            <div key={itemKey} className="px-4 py-1">
              <div className="mb-1 mt-3 text-sm font-bold uppercase tracking-wider text-gray-500 first:mt-0">
                {item.name}
              </div>

              {item.children!.map((child) => (
                <Link
                  key={child.id || child.href}
                  href={child.href}
                  className={`block rounded px-3 py-2 text-base transition-colors ${
                    pathname === child.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          );
        }

        if (hasChildren && !item.isGroup) {
          return (
            <div
              key={itemKey}
              className="group relative"
              onMouseEnter={() => onItemHover(item.id || item.href)}
            >
              <div
                className={`flex cursor-pointer items-center justify-between px-4 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span>{item.name}</span>

                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              {isHovered && (
                <div
                  className="absolute left-full top-0 z-50 ml-1 overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-xl"
                  style={{
                    width: "280px",
                    minWidth: "280px",
                    maxWidth: "280px",
                    maxHeight: "400px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  }}
                >
                  {item.children!.map((child) => (
                    <Link
                      key={child.id || child.href}
                      href={child.href}
                      className={`block px-4 py-3 text-base transition-colors ${
                        pathname === child.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={itemKey}
            href={item.href}
            className={`block px-4 py-3 text-base transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}