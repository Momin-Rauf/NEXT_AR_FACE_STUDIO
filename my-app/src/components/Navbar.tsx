'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image'; 
import { FaBars } from 'react-icons/fa';  // Import React Icon

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
    <div ref={navbarRef} className="border-1 fixed z-10 shadow-md border-[1px] w-[100%] p-3 bg-white text-black flex flex-row items-center justify-between">
      {/* Logo */}
      <Image src="/walee-logo.png" alt="Logo" width={100} height={100} className="sm:w-[10%] sm:h-[10%]" /> {/* Adjust width and height as needed */}

      {/* Navigation links for desktop */}
      <ul className="sm:flex sm:text-lg sm:items-center sm:mx-4 sm:flex-row sm:gap-8 hidden">
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/AssetsPage">My Assets</Link>
        </li>
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/about">About Us</Link>
        </li>
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/services">Services</Link>
        </li>
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/contact">Contact Us</Link>
        </li>

        {/* Conditional rendering for session status */}
        {session && (
          <li className="menu relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300 menu-horizontal px-1">
            <button onClick={() => signOut()}>Logout</button>
          </li>
        )}
      </ul>

      {/* Sidebar for mobile */}
      <div className="sm:hidden border-2 w-8 drawer drawer-end"> {/* Keep drawer-end for right position */}
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer-4" className="drawer-button bg-white">
            <FaBars size={24} /> {/* Using the Bars icon from React Icons */}
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-white text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li><Link href="/AssetsPage">My Assets</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>

            {/* Conditional rendering for session status */}
            {session && (
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
