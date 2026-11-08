// components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/navigation";
import Navbar from "./Navbar";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled || !isHomePage ? "bg-[#0a1628] shadow-lg" : "bg-transparent"
      }`}
    >
      {/* Full width, no container. Navbar adds the 10px left/right padding itself. */}
      <div className="flex h-20 w-full items-center">
        <Navbar
          items={navigation}
          pathname={pathname}
          isScrolled={isScrolled}
          isHomePage={isHomePage}
        />
      </div>

      {/* Bottom line */}
      <div className="h-[1px] w-full bg-white/30" />
    </header>
  );
}