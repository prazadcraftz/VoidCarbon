'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function SiteHeader() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'home';
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { view: 'home', href: '/?view=home', label: 'Home' },
    { view: 'calculator', href: '/?view=calculator', label: 'Calculator' },
    { view: 'dashboard', href: '/?view=dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f2318] border-b border-white/5 h-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link 
              href="/?view=home" 
              className="flex items-center gap-2.5 select-none" 
              aria-label="VoidCarbon Home"
              onClick={() => setIsOpen(false)}
            >
              <svg viewBox="0 0 100 100" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left half circle (dark green) */}
                <path d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100V0Z" fill="#14532D" />
                {/* Right half circle (emerald green) */}
                <path d="M50 0V100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0Z" fill="#166534" />
                {/* Leaf background (white) */}
                <path d="M50 15C33 35 33 65 50 85C67 65 67 35 50 15Z" fill="#FFFFFF" />
                {/* Leaf center vein */}
                <path d="M50 15V85" stroke="#14532D" strokeWidth="3" strokeLinecap="round" />
                {/* Leaf side veins */}
                <path d="M50 35L38 43M50 35L62 43M50 50L36 60M50 50L64 60M50 65L38 75M50 65L62 75" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />
                {/* Stem */}
                <path d="M50 85V93" stroke="#14532D" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <span className="text-lg font-semibold tracking-tight text-white">
                Void<span className="text-[#c8e6d0]">Carbon</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                    isActive 
                      ? 'text-white underline underline-offset-4 decoration-2 decoration-[#1a7a4a]' 
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/85 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a7a4a]"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav 
          className="absolute top-14 left-0 w-full bg-[#0f2318] border-b border-white/5 p-4 flex flex-col gap-2.5 z-50 shadow-lg sm:hidden"
          aria-label="Mobile Navigation"
        >
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive 
                    ? 'text-white bg-white/5 underline underline-offset-4 decoration-2 decoration-[#1a7a4a]' 
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
