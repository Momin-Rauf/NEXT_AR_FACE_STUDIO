'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { useSession,signOut } from "next-auth/react";
signOut
import Image from 'next/image'; // Import Image from next/image

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
      <Image src="/walee-logo.png" alt="Logo" width={100} height={100} className="w-[10%] h-[10%]" /> {/* Adjust width and height as needed */}

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

        {/* Conditional rendering for session status */}
        {session && (
         
            
            <li className="menu relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300 menu-horizontal px-1">
      
          <button onClick={() => signOut()} >Logout</button>
           
         </li>
        ) }
      </ul>
    </div>
  );
};

export default Navbar;
