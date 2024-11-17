"use client";

import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaHome, FaUserAlt, FaEnvelope, FaTags } from "react-icons/fa";
import { Footer } from "@/components/footer";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams?.admin === "true";

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
      name: "Pricing",
      link: "/pricing",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  const logo = "/assets/icons/logo-doctorsclub.svg";

  return (
    <div className="relative w-full">
      {/* Floating Navbar */}
      <FloatingNav navItems={navItems} logo={logo} />  

      {/* Privacy Policy Section */}
      <section className="flex flex-col items-center justify-center py-16 mt-24 sm:mt-28 lg:mt-32 px-6 sm:px-8 lg:px-10 text-black dark:text-white">
        <h2 className="text-4xl font-bold md:text-3xl lg:text-4xl mb-12 py-3 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white text-center">
          Privacy Policy
        </h2>
        
        <div className="max-w-4xl text-left leading-relaxed text-base sm:text-sm md:text-lg">
          <p className="mb-4">Last updated: September 7, 2024</p>

          <p className="mb-6">
            At <strong>doctorsClub</strong>, we are committed to safeguarding your privacy. This Privacy Policy explains how we collect, use, and protect the personal information you provide when you interact with our website or services. By accessing our website, you consent to the terms outlined in this policy.
          </p>

          <h3 className="text-2xl font-semibold mb-4">1. Information We Collect</h3>
          <p className="mb-4">
            When you engage with <strong>doctorsClub</strong>, we may collect the following types of personal information:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Personal Identification Information: Name, contact information (such as email address and phone number), and demographic details.</li>
            <li className="mb-2">User Feedback and Preferences: Information gathered through surveys, feedback forms, or promotional offers.</li>
            <li className="mb-2">Website Usage Data: Data collected through cookies and similar technologies to analyze site traffic and enhance your experience.</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">2. Purpose of Data Collection</h3>
          <p className="mb-4">We collect and process your information to improve your experience and provide better services, including:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Internal record-keeping and platform management.</li>
            <li className="mb-2">Personalizing your experience and improving our services.</li>
            <li className="mb-2">Sending promotional communications about new products, special offers, or other relevant information.</li>
            <li className="mb-2">Contacting you for market research or feedback on our services.</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">3. Use of Cookies</h3>
          <p className="mb-4">
            Cookies are small files stored on your device that help us understand how you use our website and tailor it to your needs. <strong>doctorsClub</strong> uses cookies for:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Website Performance: To analyze which pages are visited and optimize site performance.</li>
            <li className="mb-2">Customization: To personalize content based on your preferences and past activity.</li>
          </ul>
          <p className="mb-4">
            You can control the use of cookies by adjusting your browser settings. Disabling cookies may limit some features of our website.
          </p>

          <h3 className="text-2xl font-semibold mb-4">4. Protecting Your Data</h3>
          <p className="mb-6">
            Your privacy is a priority for us. <strong>doctorsClub</strong> employs suitable measures to protect your data from unauthorized access or disclosure. We regularly review our security practices to ensure your information remains secure.
          </p>

          <h3 className="text-2xl font-semibold mb-4">5. Sharing of Information</h3>
          <p className="mb-6">
            We do not sell, share, or lease your personal data to third parties without your explicit consent unless required by law. However, we may send you promotional content from trusted third parties if you opt-in to receive such communications.
          </p>

          <h3 className="text-2xl font-semibold mb-4">6. Controlling Your Information</h3>
          <p className="mb-4">
            You have the right to control how your personal information is used. You may choose to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Opt-out of Marketing: Unsubscribe from our marketing communications at any time.</li>
            <li className="mb-2">Access and Update: If you believe the information we hold is inaccurate or incomplete, you can request corrections.</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">7. Changes to this Privacy Policy</h3>
          <p className="mb-6">
            <strong>doctorsClub</strong> may periodically update this policy. We recommend checking this page regularly to stay informed about how we protect your information. Continued use of our services after changes to the policy constitutes your acceptance of the updated terms.
          </p>

          <h3 className="text-2xl font-semibold mb-4">8. Contact Us</h3>
          <p className="mb-6">
            For any questions or concerns regarding this Privacy Policy, or if you wish to manage your personal information, please visit our <Link href="/contact" className="text-blue-500 hover:underline">Contact Page</Link> to get in touch with us.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}    