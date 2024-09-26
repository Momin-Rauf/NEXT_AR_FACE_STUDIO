// Home.tsx
'use client';
import './globals.css';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'
import AboutWalee from '@/components/AboutWalee'
export default function Home() {

  return (
    <>
      <Navbar />
      
      <HeroSection/>
      <AboutSection/>
      <AboutWalee/>
      <Footer/>
    </>
      
  );
}
