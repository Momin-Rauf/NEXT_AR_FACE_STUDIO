import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link'; // Import Link from next/link

const Navbar = () => {
  const navbarRef = useRef<HTMLDivElement | null>(null); // Reference for the entire navbar

  useEffect(() => {
    // Ensure navbarRef is available
    if (navbarRef.current) {
      // Animate everything together
      gsap.fromTo(
        navbarRef.current.children,
        { opacity: 0, y: -50 }, // Start from off-screen at the top
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2, // Delay between each element (logo and links)
        }
      );
    }
  }, []);

  return (
    <div ref={navbarRef} className="border-1 p-3 bg-white text-black flex flex-row items-center justify-between">
      {/* Logo */}
      <img src="/walee-logo.png" className="w-[10%] h-[10%]" alt="Logo" />

      {/* Navigation links */}
      <ul className="flex text-lg items-center mx-4 flex-row gap-8">
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/AssetsPage">My Assets</Link>
        </li>
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/about">About us</Link>
        </li>
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/services">Services</Link>
        </li>
        <li className="relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300">
          <Link href="/contact">Contact us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
