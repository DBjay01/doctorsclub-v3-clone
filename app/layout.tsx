import { ClerkProvider } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';
import { Plus_Jakarta_Sans as FontSans } from 'next/font/google';
import Script from 'next/script'; 
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';    
import { GoogleTagManager } from '@next/third-parties/google'  
import './globals.css';

// Font configuration with preloading for better performance
const fontSans = FontSans({  
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',   
  display: 'swap',  // Ensures the font swap happens while loading
  preload: true,    // Preload the font to improve First Contentful Paint
}); 

export const metadata = {
  title: {
    template: '%s - doctorsClub',
    default: 'doctorsClub',
  },
  description: 'doctorsClub rewards patients with cashback and exclusive offers on their doctor appointments, while simplifying appointment management for clinics and hospitals.',
  keywords: [
    "doctorsClub",
    "Appointment Management",
    "Patient Management",
    "clinic management",
    "hospital management",
    "Clinic Efficiency",
    "Healthcare Tech",
    "bydoctorsclub",
    "doctorsclub",
    "the doctorsclub",
    "Doctors Club",
    "Doctorsclub", 
    "doctorsclub pune",
    "doctorsclub india",
    "Cashback",
    "Exclusive Offers",
    "Save medical costs",
    "doctors",
    "patients",
    "the doctorsclub",
    "doctorsclubs",
  ],
  openGraph: {
    title: 'doctorsClub', 
    description: 'doctorsClub rewards patients with cashback and exclusive offers on their doctor appointments, while simplifying appointment management for clinics and hospitals.',
    url: 'https://bydoctorsclub.com', 
    siteName: 'doctorsClub',
    images: [
      {
        url: '/assets/icons/logo-doctorsclub.svg',
        width: 1200,  
        height: 630,  
        alt: 'doctorsClub',   
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',  
    title: 'doctorsClub',
    description: 'doctorsClub rewards patients with cashback and exclusive offers on their doctor appointments, while simplifying appointment management for clinics and hospitals.',
    images: ['/assets/icons/logo-doctorsclub.svg'],
  },
};  

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
        variables: { colorPrimary: 'blue' },
      }}
    >
      <html lang="en">
        <head>
          {/* Preconnect to font domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Preload and load font styles */}
          <link 
            rel="preload" 
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" 
            as="style" 
          />
          <link 
            rel="stylesheet" 
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" 
          />

          {/* Google Tag Manager */}
          {/* <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NVH9M7JR');`,
            }}
          /> */}
          <GoogleTagManager gtmId="GTM-NVH9M7JR" />      
        </head>
        <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.variable)}>
        
          <ThemeProvider attribute="class" defaultTheme="dark">
           
            {children}
            {/* Vercel Analytics */}
            <Analytics />
            {/* Speed Insights */}
            <SpeedInsights />  
          </ThemeProvider>
     
        </body>
      </html>
    </ClerkProvider>
  );
}     