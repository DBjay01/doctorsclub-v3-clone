import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign Up ',
  description: 'Sign up to doctorsClub.',
  openGraph: {
    title: 'Sign Up - doctorsClub',   
    description: 'Sign up to doctorsClub.',
    url: 'https://bydoctorsclub.com/sign-up', 
    siteName: 'doctorsClub', 
    images: [
      {
        url: '/assets/icons/logo-doctorsclub.svg',
        width: 1200,
        height: 630,
        alt: 'doctorsClub Logo',
      },
    ],
    type: 'website',
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        {/* Company Logo on the left */}
        <div>
          <Link href="/"> 
            <Image 
              src="/assets/icons/logo-doctorsclub.svg" // Replace with your logo's path
              alt="Company Logo"
              width={110} 
              height={50}  
            />
          </Link>
        </div>
      </div> 

      {/* Main Content */}
      <main className="flex flex-grow justify-center items-center mt-20 p-2 md:p-8">
        <div className="w-full max-w-md p-4 rounded-lg shadow-lg">
          <SignUp forceRedirectUrl="/patients/register" />
        </div>
      </main>
    </div>
  )
}        