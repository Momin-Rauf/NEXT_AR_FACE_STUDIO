'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { FiMenu } from "react-icons/fi";

import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';
import { FaHome, FaInfoCircle, FaServicestack, FaPhone, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current.children,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
        }
      );
    }
  }, []);

  return (
    <div ref={navbarRef} className="fixed z-10 shadow-md w-full p-3 bg-white text-black flex items-center justify-between">
      {/* Logo */}
      <Image src="/walee-logo.png" alt="Logo" width={100} height={100} className="sm:w-[10%] sm:h-[10%]" />

      {/* Navigation links for desktop */}
      <ul className="hidden sm:flex sm:text-lg sm:items-center sm:gap-8">
        <li className="relative cursor-pointer hover:after:w-full after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all">
          <Link href="/AssetsPage">My Assets</Link>
        </li>
        <li className="relative cursor-pointer hover:after:w-full after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all">
          <Link href="/about">About Us</Link>
        </li>
        <li className="relative cursor-pointer hover:after:w-full after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all">
          <Link href="/services">Services</Link>
        </li>
        <li className="relative cursor-pointer hover:after:w-full after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all">
          <Link href="/contact">Contact Us</Link>
        </li>

        {session && (
          <li className="relative cursor-pointer hover:after:w-full after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all">
            <button onClick={() => signOut()} className="flex items-center gap-2">
              <FaSignOutAlt /> Logout
            </button>
          </li>
        )}
      </ul>

      {/* Sidebar for mobile */}
      <div className="drawer sm:hidden z-10 drawer-end">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center justify-end">
          {/* Sidebar button */}
          <label
            htmlFor="my-drawer"
            aria-label="open sidebar"
            className="cursor-pointer p-2 bg-gray-200 rounded-md"
          >
            <FiMenu className="h-6 w-6 text-primary" />
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
            {/* Sidebar items */}
            <li>
              <Link href="/AssetsPage" className="flex items-center gap-2">
                <FaHome /> My Assets
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex items-center gap-2">
                <FaInfoCircle /> About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="flex items-center gap-2">
                <FaServicestack /> Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="flex items-center gap-2">
                <FaPhone /> Contact Us
              </Link>
            </li>
            {session && (
              <li>
                <button onClick={() => signOut()} className="flex items-center gap-2">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
