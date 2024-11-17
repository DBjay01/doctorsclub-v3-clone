import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaHome, FaUserAlt, FaEnvelope, FaTags } from "react-icons/fa";
import { ContactCard } from "@/components/ContactCard";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });

export default function Home({ searchParams }: SearchParamProps) {
  

  return (
    <div className="flex flex-col bg-black min-h-screen overflow-x-hidden">
      {/* Floating Navbar */} 
      <Navbar />   

      <ShootingStars />
      <StarsBackground /> 

      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center mt-44 sm:mt-52 md:mt-48 lg:mt-54 xl:mt-62 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 lg:pb-24">
        <ContactCard />       
      </main>       

      {/* Footer Section */}  
      <footer className="mt-16 sm:mt-20 md:mt-24 lg:mt-28">    
        <Footer />
      </footer>
    </div>
  );
}                     