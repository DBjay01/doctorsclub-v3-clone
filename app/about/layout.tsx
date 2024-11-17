export const metadata = {
    title: 'About',
    description: 'Learn more about doctorsClub.',
    openGraph: {
      title: 'About doctorsClub',
      description: 'Find out how doctorsClub empowers clinics and hospitals with efficient appointment management and makes patients medical journey more rewarding.',
      url: 'https://bydoctorsclub.com/about',
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
      title: 'About doctorsClub',
      description: 'Learn more about doctorsClub and how it helps clinics and hospitals manage patient appointments and rewards patients.',
      images: ['/assets/icons/logo-doctorsclub.svg'], 
    },   
};
   
  
export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}