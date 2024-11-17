"use client";

import { FloatingNav } from "@/components/ui/floating-navbar";
import dynamic from "next/dynamic";
import { FaHome, FaUserAlt, FaEnvelope, FaTags } from "react-icons/fa";

const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });    

export default function Home({ searchParams }: SearchParamProps) {

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Contact",
      link: "/contact",   
    },
  ];

  const logo = "/assets/icons/logo-doctorsclub.svg";

  return (
    <div className="relative w-full min-h-screen flex flex-col"> 
      {/* Add Floating Navbar */}
      <FloatingNav navItems={navItems} logo={logo} /> 

      {/* Add padding to push content below the navbar */}
      <section className="flex flex-col items-center justify-center h-auto py-8 px-4 sm:px-6 lg:px-8 text-black dark:text-white mt-24 sm:mt-32 lg:mt-36">
        <h2 className="font-bold text-4xl sm:text-3xl md:text-4xl lg:text-5xl mt-14 sm:mt-18 lg:mt-16 mb-14 sm:mb-18 lg:mb-16 text-center sm:text-left relative z-4 py-3 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          Cancellation & Refund Policy
        </h2>     

        <div className="max-w-4xl w-full text-left mb-14 leading-relaxed text-sm sm:text-base md:text-lg dark:text-white">
          <p className="mb-4">Last updated: September 7, 2024</p>

          <p className="mb-5">
              doctorsClub&#39;s believes in helping its customers as far as possible, and
              has therefore adopted a liberal cancellation and refund policy. Under
              this policy:
          </p>

          <ul className="list-disc ml-5 space-y-2">
            <li>
              Cancellations will be considered only if the request is made within
              the same day of placing the order. However, the cancellation request
              may not be entertained if the orders have been communicated to the
              vendors/merchants and they have initiated the process of shipping
              them.
            </li>
            <li>
              doctorsClub does not accept cancellation requests for perishable
              items like flowers or food. However, refunds or replacements can be
              made if the customer establishes that the quality of the product
              delivered is unsatisfactory.
            </li>
            <li>
              In case of receipt of damaged or defective items, please report this
              to our Customer Service team immediately upon receipt of the
              products. We will entertain the request only after the merchant has
              verified and checked the issue.
            </li>
            <li>
              If you feel the product received does not match your expectations or
              what was shown on the site, please bring it to the notice of our
              Customer Service team within the same day of receipt. After
              reviewing your complaint, an appropriate decision will be made.
            </li>
            <li>
              For products that come with a manufacturer's warranty, complaints
              should be referred directly to the manufacturer.
            </li>
            <li>
              Refunds, if approved by doctorsClub, will take 1-2 business days to
              process and be credited to the end customer.
            </li>
          </ul>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}   