import dynamic from "next/dynamic"; // For code-splitting & lazy loading
import { memo } from "react";
import { Metadata } from "next";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Script from "next/script";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { BackgroundLines } from "@/components/ui/background-lines";
import Navbar from "@/components/Navbar";
 
// Lazy-load Footer to improve initial load time 
const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });  

const logo = "/assets/icons/logo-doctorsclub.svg";

// Memoize About component to avoid unnecessary re-renders
const About = memo(() => {
  return (
    <div className="relative w-full bg-black min-h-screen overflow-hidden flex flex-col">
    {/* Essential Floating Navbar (no lazy-loading) */}
    <Navbar />  

    {/* Background Elements */}
    <main>
      <section className="flex flex-col items-center justify-center py-16 px-6 sm:px-8 lg:px-10 text-black dark:text-white mt-24 sm:mt-32 lg:mt-36">
        <StarsBackground />
        <h1 className="text-5xl font-bold text-center  mb-8 sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          About doctorsClub  
        </h1>

        <div className="max-w-4xl w-full text-left leading-relaxed text-base sm:text-sm md:text-lg dark:text-white">
        
          <p className="mb-10 mt-10 text-sm sm:text-base md:text-lg">
            doctorsClub is a platform that simplifies appointment management for doctors and rewards patients with cashbacks and offers. Designed for clinics and hospitals, we provide a fast, efficient, and scalable solution for managing patient appointments. We help healthcare providers transition seamlessly from traditional pen-and-paper methods to a fully digital system. Our platform is not only affordable but also user-friendly, with an intuitive interface that simplifies patient management, streamlines clinic operations, and improves overall efficiency. We also help patients save money on their medical costs.
          </p> 
          
          <p className="mb-14 text-sm sm:text-base md:text-lg">
            Headquartered in Pune, doctorsClub is dedicated to empowering clinics and hospitals with advanced technology. We understand the unique challenges that doctors face and have built a solution that makes digital record-keeping effortless. In addition to patient management, we offer features like data analysis too, helping doctors stay informed and organized. By reducing administrative tasks, we allow healthcare professionals to focus more on delivering high-quality patient care, making digital management accessible and impactful for all.
          </p> 
        </div>
      </section>
    </main> 

    {/* Background Lines Demo */}
     
    {/* Lazy Load Third-Party Scripts */}
    <Script 
      src="https://www.google-analytics.com/analytics.js" 
      strategy="lazyOnload" 
    />

    <Footer /> 
      
  </div>
  );
});

About.displayName = "About";

export default About;    