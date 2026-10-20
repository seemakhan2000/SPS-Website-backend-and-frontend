// components/layout/MobileMenu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavItem } from '@/data/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  items: NavItem[];
  pathname: string;
}

export default function MobileMenu({ isOpen, items, pathname }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderNavItems = (navItems: NavItem[], level: number = 0) => {
    return navItems.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.includes(item.id || item.href);
      const isActive = pathname === item.href;
      const isGroup = item.isGroup === true;
      const itemKey = item.id || `item-${item.name}`;

      return (
        <div key={itemKey} className="border-b border-gray-100 last:border-0">
          {hasChildren ? (
            <div>
              <button
                onClick={() => toggleExpand(item.id || item.href)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : isGroup
                    ? 'text-gray-500 text-xs font-bold uppercase tracking-wider'
                    : 'text-gray-700'
                }`}
                style={{ paddingLeft: `${level * 16 + 16}px` }}
              >
                <span className={isGroup ? 'font-bold' : 'font-medium'}>
                  {item.name}
                </span>
                {!isGroup && (
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
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
                )}
              </button>
              {isExpanded && (
                <div className="bg-gray-50">
                  {renderNavItems(item.children!, level + 1)}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.href}
              className={`block px-4 py-3 transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              style={{ paddingLeft: `${level * 16 + 16}px` }}
            >
              {item.name}
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <div className="md:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-80px)] overflow-y-auto">
      {renderNavItems(items)}
    </div>
  );
}