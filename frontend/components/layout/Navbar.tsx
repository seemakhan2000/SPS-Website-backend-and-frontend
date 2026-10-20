// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { NavItem } from '@/data/navigation';
import Image from 'next/image';

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
  isHomePage = false 
}: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    if (href === '#') return false;
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
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  return (
    <nav className="hidden md:flex w-full items-center space-x-6">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isItemActive = isActive(item.href);
        const isDropdownOpen = activeDropdown === item.href;
        const isMegaMenu = ['Products', 'Services', 'Verticals'].includes(item.name);

        return (
          <div
            key={item.id || item.href}
            className="relative"
            onMouseEnter={() => hasChildren && handleMouseEnter(item.href)}
            onMouseLeave={handleMouseLeave}
          >
            {hasChildren ? (
              <>
                <button
                  className={`text-base font-medium tracking-wide transition-colors ${
                    isItemActive || isDropdownOpen
                      ? isTransparent
                        ? 'text-white'
                        : 'text-white'
                      : isTransparent
                      ? 'text-white/80 hover:text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                  <svg
                    className={`inline-block ml-1 w-3 h-3 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
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

                {isDropdownOpen && hasChildren && (
                  isMegaMenu ? (
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
                  )
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`text-base font-medium tracking-wide transition-colors ${
                  isItemActive
                    ? isTransparent
                      ? 'text-white'
                      : 'text-white'
                    : isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
     <Link
  href="/admin/login"
  className="ml-auto inline-flex items-center whitespace-nowrap rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#0a1628]"
>
  Admin Login
</Link>
    </nav>
  );
}

// ============================================================
// MEGA MENU - Products, Services, Verticals
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
    columns: [['SPS'], ['IBM'], ['Others']],
    panel: {
      image: '/images/products/products.webp',
      description:
        'SPS empowers enterprises with Cybersecurity, Cloud, AI & Automation solutions designed to scale and secure digital transformation.',
      buttonLabel: 'View All Products',
      buttonHref: '/products',
    },
  },
  Services: {
    minHeight: 460,
    columns: [
      ['Cybersecurity', 'Training'],
      ['Cloud'],
      ['AI & Automation'],
      ['Collaboration'],
    ],
    panel: {
      image: '/images/services/services.webp',
      description:
        'SPS empowers enterprises with Cybersecurity, Cloud, AI & Automation solutions designed to scale and secure digital transformation.',
      buttonLabel: 'Discover More',
      buttonHref: '/services',
    },
  },
  Verticals: {
    minHeight: 520,
    columns: [
      ['Public Sector', 'Energy'],
      ['Industrial', 'Financial'],
      ['Healthcare', 'Telecommunications'],
      ['Retail'],
    ],
    panel: {
      image: '/images/verticals/verticals.webp',
      description:
        "Accelerate your county's digital transformation with an executive-led strategy focused on cybersecurity, cloud, and AI.",
      buttonLabel: 'Discover More',
      buttonHref: '/verticals',
    },
  },
};

function getItemsByNames(items: NavItem[], names: string[]): NavItem[] {
  return names
    .map((n) => items.find((i) => i.name === n))
    .filter((i): i is NavItem => Boolean(i));
}

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
      className="fixed left-0 right-0 top-[80px] w-screen bg-white shadow-xl border-t border-gray-200 z-50 overflow-y-auto"
      style={{
        minHeight: `${config.minHeight}px`,
        maxHeight: `${config.minHeight + 60}px`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      }}
    >
      <div
        className="max-w-[1400px] mx-auto px-4"
        style={{
          display: 'grid',
          gridTemplateColumns: `180px repeat(${config.columns.length}, 1fr)`,
          gap: '12px',
          padding: '16px 0',
        }}
      >
        {/* Left Panel - Image + Description */}
        <div className="pr-2 border-r border-gray-100">
          <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-gray-100 relative">
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <span className="text-3xl font-bold text-blue-400">
                  {parentName === 'Products' ? '🛠️' : 
                   parentName === 'Services' ? '⚡' : '🏢'}
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            {config.panel.description}
          </p>
          <Link
            href={config.panel.buttonHref}
            className="inline-block px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-colors"
          >
            {config.panel.buttonLabel} →
          </Link>
        </div>

        {/* Columns */}
        {config.columns.map((groupNames, colIdx) => {
          const groups = getItemsByNames(items, groupNames);
          return (
            <div key={colIdx} className="flex flex-col gap-3">
              {groups.map((group) => (
                <div key={group.id || group.name}>
                  <div className="text-base font-bold text-gray-900 pb-1.5 mb-1.5 border-b border-gray-200">
                    {group.name}
                  </div>
                  <div className="flex flex-col gap-1">
                    {(group.children || []).map((child) => (
                      <Link
                        key={child.id || child.href}
                        href={child.href}
                        className={`text-base transition-colors ${
                          pathname === child.href
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-600 hover:text-blue-600'
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
// REGULAR DROPDOWN - Spinnlabs, Activities, About Us, Contracts
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
      className="absolute top-[50] left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-y-auto"
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        maxHeight: '400px',
        padding: '8px 0',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      }}
    >
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = pathname === item.href;
        const isHovered = hoveredItem === item.id;
        const itemKey = item.id || `item-${item.name}`;

        if (hasChildren && item.isGroup) {
          return (
            <div key={itemKey} className="px-4 py-1">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 mt-2 first:mt-0">
                {item.name}
              </div>
              {item.children!.map((child) => (
                <Link
                  key={child.id || child.href}
                  href={child.href}
                  className={`block px-3 py-1.5 text-base transition-colors rounded ${
                    pathname === child.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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
              className="relative group"
              onMouseEnter={() => onItemHover(item.id || item.href)}
            >
              <div
                className={`px-4 py-2.5 text-base font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{item.name}</span>
                <svg
                  className="w-4 h-4 text-gray-400"
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
                  className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 overflow-y-auto"
                  style={{
                    width: '260px',
                    minWidth: '260px',
                    maxWidth: '260px',
                    maxHeight: '400px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  }}
                >
                  {item.children!.map((child) => (
                    <Link
                      key={child.id || child.href}
                      href={child.href}
                      className={`block px-4 py-2.5 text-base transition-colors ${
                        pathname === child.href
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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
            className={`block px-4 py-2.5 text-base transition-colors ${
              isActive
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
           
    </div>
  );
}