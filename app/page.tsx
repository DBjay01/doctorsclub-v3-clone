"use client";

import dynamic from "next/dynamic"; // For code-splitting & lazy loading
import { memo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cover } from "@/components/ui/cover"; 
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Script from "next/script";  
import { sendGTMEvent } from "@next/third-parties/google";
import SparklesText from "@/components/ui/sparkles-text";
import Navbar from "@/components/Navbar";
import { MarqueeDemo } from "@/components/MarqueeDemo";
import { StarsBackground } from "@/components/ui/stars-background";
  
// Lazy-load Footer to improve initial load time
const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });

// Memoize Home component to avoid unnecessary re-renders 
const Home = memo(() => {
  
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Essential Floating Navbar (no lazy-loading) */}
      <Navbar /> 
      <StarsBackground />   
      
      {/* Hero Section */}   
      <section className="flex flex-col bg-black items-center justify-center py-8 px-4 md:px-8 lg:px-16 h-screen ">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-4">  
        <SparklesText text="Say yes to appointments." className="text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl" />   
        </h1>    
        <p className="text-md mt-4 sm:text-lg md:text-lg font-semibold lg:text-2xl text-center">get exclusive offers on booking appointments with your doctors.</p>
        <div className="flex flex-col md:flex-row mt-11 relative z-50 space-y-9 md:space-y-0 space-x-0 md:space-x-4">
          <Link href="/sign-in">  
            <button  onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'Sign In' })} className="w-40 h-10 font-semibold rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
              Sign In       
            </button>         
          </Link>  
          <Link href="/sign-up">
            <button  onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'Sign In' })} className="w-40 h-10 font-semibold rounded-xl bg-white text-black border border-black text-sm relative z-50">
              Sign Up   
            </button>
          </Link>                   
        </div>
      </section>

      {/* Optimized Image and Container */}
      <MarqueeDemo />


      {/* Lazy-loaded Footer */}
      <Footer />

    </div>
  );
});

Home.displayName = "Home"; 

export default Home;   
 

//working part 1   