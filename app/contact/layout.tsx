export const metadata = {
    title: 'Contact',
    description: 'Feel free to Contact Us.',
    openGraph: {
      title: 'Contact doctorsClub',
      description: 'Reach out to doctorsClub for any inquiries or support.',
      url: 'https://bydoctorsclub.com/contact',
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
      title: 'Contact doctorsClub',
      description: 'Reach out to doctorsClub for any inquiries or support.',
      images: ['/assets/icons/logo-doctorsclub.svg'], 
    },   
};
    
  
export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}