export const metadata = {
    title: 'Doctors',
    description: 'Enhance your clinic and hospital operations with appointment management system from doctorsClub.',
    openGraph: {
      title: 'Doctors - doctorsClub',
      description: 'Enhance your clinic and hospital operations with appointment management system from doctorsClub.',
      url: 'https://bydoctorsclub.com/doctors',
      siteName: 'doctorsClub',
      images: [
        {
          url: '/assets/icons/logo-doctorsclub.svg',
          width: 1200,
          height: 630,
          alt: 'doctorsClub logo',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Doctors -  doctorsClub',
      description: 'Enhance your clinic and hospital operations with appointment management system from doctorsClub..',
      images: ['/assets/icons/logo-doctorsclub.svg'],  
    },   
};
    
  
export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
} 