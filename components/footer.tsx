"use client"; 

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-32 mt-22 text-center bg-black">
      <div className="container mx-auto px-4">
        <p className="text-neutral-700 dark:text-white text-2xl mb-4">
          &copy; 2024 doctorsClub. All rights reserved. 
        </p>
        <div className="space-x-4">
          <Link href="/terms" className="text-neutral-600 dark:text-neutral-300 hover:underline">
            Terms & Conditions
          </Link>
          <Link href="/cancellation-and-refund" className="text-neutral-600 dark:text-neutral-300 hover:underline">
            Cancellation & Refund Policy
          </Link>
          <Link href="/privacy" className="text-neutral-600 dark:text-neutral-300 hover:underline">
            Privacy Policy 
          </Link>
        </div>
      </div>
    </footer>
  );
}     