// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { navigation } from '@/data/navigation';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Check if on home page
  const isHomePage = pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHomePage
          ? 'bg-[#0a1628] shadow-lg' 
          : 'bg-transparent'          
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center">
              <Image
                src="/images/logo/logowhitenew-480.webp"
                alt="SPS"
                width={350}
                height={350}
                className="object-contain"
                priority
              />
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <Navbar 
            items={navigation} 
            pathname={pathname}
            isScrolled={isScrolled}
            isHomePage={isHomePage}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled || !isHomePage ? 'hover:bg-blue-600' : 'hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <span className={`block w-full h-0.5 transition-all duration-300 bg-white ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''
              }`} />
              <span className={`block w-full h-0.5 transition-all duration-300 bg-white ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`block w-full h-0.5 transition-all duration-300 bg-white ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* 🔥 LINE - HAMESHA SHOW HO GI (Scroll ke baghair bhi) */}
      <div className="h-[1px] w-screen bg-white/30" />

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        items={navigation} 
        pathname={pathname} 
      />
    </header>
  );
}