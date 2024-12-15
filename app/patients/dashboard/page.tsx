'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { StarsBackground } from "@/components/ui/stars-background";
import Image from 'next/image'
import { toZonedTime, format } from 'date-fns-tz';
import { useAuth, UserButton } from '@clerk/nextjs'
import { IconSearch } from '@tabler/icons-react'; 
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, MapPin, Phone, Stethoscope, User, Clock, Tag, CheckCircle, CheckCircle2 } from 'lucide-react'

import { getAppointmentsByUserId, getAppointmentsByUserIds, getCouponsByUserId } from '@/lib/actions/appointment.actions';
import { getAllDoctors, getDoctorsByPage } from '@/lib/actions/doctor.actions';  
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { getPatientByUserId } from '@/lib/actions/patient.actions'
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { cancelAppointment  } from '@/lib/actions/appointment.actions'; // Add this import
   
interface Doctor {
  image: string
  clinicName: string
  clinicAddress: string     
  clinicPhone: string
  doctorName: string
  specialty: string
  email: string
  doctorId: string
} 

interface Appointment {
  $id: string
  id: string
  patient: string
  schedule: string 
  reason: string
  note: string
  primaryPhysician: string
  status: string
  userId: string
  cancellationReason: string
  doctorId: string
  createdAt: string
}

interface Coupon {
  imageUrl: string;
  id: number
  partner: string
  code: string
  link: string
  description: string
  discount?: string
  // imageUrl: string
}

const DoctorCard = ({ doctor, onBookAppointment }: { doctor: Doctor, onBookAppointment: (doctor: Doctor) => void }) => {
  const [isOpen, setIsOpen] = useState(false)


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      <Card className="group overflow-hidden cursor-pointer bg-gray-800/80 backdrop-blur-sm text-white border border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-500/50">
        <div className="flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src={doctor.image || '/placeholder.svg'}
              alt={`Dr. ${doctor.doctorName}`}
              width={400} 
              height={300}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />   
          </div>

          <CardContent className="p-4">
            <CardTitle className="text-xl font-semibold text-white mb-4">
              Dr. {doctor.doctorName}
            </CardTitle>

            {/* <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Stethoscope className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{doctor.specialty}</span>
              </div>

              <div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                <span className="text-sm flex-1 line-clamp-2">{doctor.clinicAddress}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{doctor.clinicPhone}</span>
              </div>
            </div> */} 
            <div className="space-y-3">
                <InfoItem icon={Stethoscope} text={doctor.specialty} />
                <InfoItem icon={Phone} text={doctor.clinicPhone} />
                <InfoItem icon={MapPin} text={doctor.clinicAddress} />
            </div>  
          </CardContent>
        </div>
      </Card>   
      </DialogTrigger>

      <DialogContent className="bg-gray-800 text-white border border-rounded-full border-gray-700 w-[90vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Dr. {doctor.doctorName}
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-lg mb-4 sm:mb-6">
          <Image
            src={doctor.image || '/doctorsClub.png'}
            alt={`Dr. ${doctor.doctorName}`}
            layout="fill"
            objectFit="cover"
            priority
          />  
        </div>

        <div className="space-y-3 sm:space-y-4">
          <DetailItem icon={MapPin} title="Clinic" text={doctor.clinicName} />
          <DetailItem icon={Stethoscope} title="Specialty" text={doctor.specialty} />
          <DetailItem icon={Phone} title="Contact" text={doctor.clinicPhone} />
          <DetailItem icon={MapPin} title="Address" text={doctor.clinicAddress} />
        </div>

        <Button
          className="w-full mt-4 sm:mt-6 bg-blue-700 hover:bg-blue-500 text-white transition-colors duration-300 font-semibold py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          onClick={() => {
            onBookAppointment(doctor)
            setIsOpen(false)
          }}
        >
          Book Appointment
        </Button>
      </DialogContent>
    </Dialog>
  )
}

const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
    {/* Consistent Icon Size: Use same height and width across all icons for uniformity */}
    <Icon className="h-4 w-4 flex-shrink-0" />
    <span className="text-xs sm:text-sm leading-tight">{text}</span> {/* Font Size & Line Height */}
  </div>
)

const DetailItem = ({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) => (
  <div className="flex items-center gap-3">
    {/* Alignment Classes: items-center keeps the icon aligned vertically with the text block */}
    <Icon className="h-5 w-5 text-blue-500 flex-shrink-0" /> {/* Consistent Icon Size */}
    <div className="flex-1">
      {/* Font Size & Line Height: leading-tight keeps text alignment visually in line with the icon */}
      <p className="font-semibold text-white text-sm leading-tight">{title}</p>
      <p className="text-gray-300 text-xs sm:text-sm leading-tight">{text}</p>
    </div>
  </div>
);  

//new code 

export default function DoctorDashboard() {
  const { userId } = useAuth()
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])  
  const [username, setUsername] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const convertToLocalTime = (utcDatetime: string, timezone: string = 'Asia/Kolkata'): string => {
    const utcDate = new Date(utcDatetime); // Convert UTC to Date object
    // const localDatetime = toZonedTime(utcDatetime, timezone); // Convert to Asia/Kolkata
    return format(utcDate, 'yyyy-MM-dd HH:mm:ss');   
  };  
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsList, appointmentsList, couponsString] = await Promise.all([
          getAllDoctors(),
          userId ? getAppointmentsByUserIds(userId) as unknown as Appointment[] : [],
          userId ? getCouponsByUserId(userId) : ''
        ]) 

        setDoctors(doctorsList.map((doc: any) => ({ 
          clinicName: doc.clinicName,
          clinicAddress: doc.clinicAddress,
          clinicPhone: doc.clinicPhone,
          doctorName: doc.doctorName,  
          specialty: doc.specialty,
          email: doc.email, 
          doctorId: doc.doctorId,
          image: doc.image 
        })))

        setAppointments(appointmentsList)      

        const parsedCoupons = couponsString ? couponsString.split(';').map((couponStr, index) => {
          const [id, partner, code, link, description, imageUrl] = couponStr.split('|'); // Ensure imageUrl is included
          return {
            id: parseInt(id, 10),
            partner: partner || 'Unknown Partner',
            code: code || 'No Code',
            link: link || '#',
            description: description || 'No description available',
            imageUrl: imageUrl || '/public/assets/images/ajio.webp', // Ensure this is correctly assigned
          }
        }) : [];
        setCoupons(parsedCoupons);
      } catch (err: any) {
        setError('Failed to fetch data: ' + err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if(!userId){
          return;
        }

        const patient = await getPatientByUserId(userId);
        
        // Check if patient data was found and set username
        if (patient) {
          setUsername(patient.name ?? 'Unknown'); // Assuming 'username' is a field in the document
        } else {
          setUsername('Guest'); // Set a default if patient is not found
        }
      } catch (error: any) {
        setError("Error fetching patient data: " + error.message);
      }
    };

    fetchPatientData();
  }, [userId]);

  const handleBookNow = (doctor: Doctor) => {
    router.push(`/appointment?doctorName=${encodeURIComponent(doctor.doctorName)}&doctorId=${encodeURIComponent(doctor.doctorId)}`);
  }; 

  const filteredDoctors = doctors.filter(doctor => 
    doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) // Add other fields to search
  ); 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <StarsBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        {/* <div className="mt-4 sm:mt-6"> */}
          <p className="ml-6 font-semibold text-xs sm:text-sm md:text-xl lg:text-2xl animate-pulse text-center sm:text-left">
            🚀 Exploring the galaxy, please wait...
          </p>
        </div> 
    );
  }

  
  // const handleCancelAppointment = async (appointmentId: string) => {
  //   try {
  //     await deleteAppointment(appointmentId); // Call the delete function
  //     setAppointments(prev => prev.filter(appointment => appointment.$id !== appointmentId)); // Update state to remove the cancelled appointment
  //     alert("Appointment cancelled successfully.");
  //   } catch (error) {
  //     console.error("Failed to cancel appointment:", error);
  //     alert("Error cancelling appointment.");
  //   }
  // };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      // Call the cancelAppointment function to update the status in the database
      await cancelAppointment(appointmentId);
  
      // Update the local state to reflect the cancelled status
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.$id === appointmentId 
            ? { ...appointment, status: "cancelled" } // Update the status to "cancelled"
            : appointment // Keep the other appointments unchanged
        )
      );
  
      alert("Appointment cancelled successfully.");
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert("Error cancelling appointment.");
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-black text-white">
      <StarsBackground />
      <div className="relative  z-10">  
        {/* Header */} 
        <div className="mx-auto max-w-7xl bg-black px-2 sm:px-3 lg:px-4">
          <header className="py-4 bg-transparent px-6 flex items-center  justify-between ">
            <Link href="/" className="cursor-pointer flex items-center">
              <Image 
                src="/assets/icons/logo-doctorsclub.svg"
                width={82}  
                height={66}
                alt="DoctorsClub Logo"
                className="h-[76px] w-[82px] md:h-[92px] md:w-[102px] object-contain"
                priority 
              />
            </Link>
            <div className="flex items-center">
              <UserButton />
            </div> 
          </header>
        </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">  
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6">Welcome, {username || "User"}!</h1>
          <div className="relative w-84 mb-7 md:w-84"> 
              <input    
                type="text"   
                placeholder="Search " 
                className="p-2 pl-10 border rounded-full focus:outline-none w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update state on input chang 
              />
              <IconSearch className="absolute top-1/2 left-3 mb-5 transform -translate-y-1/2 text-gray-500" size={20} />
            </div> 
          

          <Tabs defaultValue="doctors" className="space-y-4 rounded-full">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-gray-800 p-1 text-gray-300">
                <TabsTrigger value="doctors" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  Doctors
                </TabsTrigger>
                <TabsTrigger value="appointments" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  My Appointments
                </TabsTrigger>
                <TabsTrigger value="coupons" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  My Coupons
                </TabsTrigger>
              </TabsList>

              <TabsContent value="doctors" className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor, index) =>(
                    <DoctorCard    
                      key={index}
                      doctor={doctor} 
                      onBookAppointment={(doctor) => {
                        setSelectedDoctor(doctor);
                        handleBookNow(doctor); 
                      }}
                    />
                  ))) : (
                    <div className="col-span-full flex flex-col items-center justify-center space-y-6 p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl">
                      {/* Thinking Emoji Icon */}
                      <motion.div
                        className="relative w-24 h-24 mt-1 mb-4"
                        animate={{
                          opacity: [0.8, 1, 0.8],  // Opacity will loop between 0.8 and 1
                          y: [20, 0, 20],         // Vertical movement from 20px to 0px and back to 20px
                        }}
                        transition={{
                          duration: 2,           // Total duration for one loop
                          repeat: Infinity,      // Repeats the animation indefinitely
                          repeatType: "loop",    // Loops the animation infinitely
                          ease: "easeInOut",     // Smooth easing for the motion
                        }}
                      >
                        <Image 
                          src="/assets/images/astron.svg" 
                          alt="Thinking Emoji"   
                          height={75}   
                          width={100} 
                         priority
                        />   
                      </motion.div> 

                      {/* Message */}
                      <motion.h3 
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1, delay: 0.7 }}
                      >
                        No doctors found.
                      </motion.h3> 

                      {/* Description */}
                      <motion.p 
                        className="text-gray-200 text-center max-w-lg sm:max-w-xl md:max-w-2xl"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1, delay: 0.9 }} 
                      >
                        We couldn't find any doctors in this part of the universe. <br /> Try refining your search, or launch to a different galaxy (specialty)! 
                      </motion.p>

                      {/* Action Button */}
                      <motion.button
                          className="mt-6 px-4 py-2 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-500 transition-all transform hover:scale-105"
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ duration: 1, delay: 1.1 }}
                          onClick={() => setSearchTerm('')} // Clears the search term
                        >
                          Try Another Search 
                        </motion.button> 
                    </div> 
                  )}       
                </div>
              </TabsContent>   

            <TabsContent value="appointments" className="space-y-4">
              <ScrollArea className="h-[600px] w-full rounded-md border border-gray-700 p-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => {
                    const doctor = doctors.find(doc => doc.doctorId === appointment.doctorId)
                    return (
                      <Card key={appointment.id} className="mb-4 bg-gray-800 text-white">
                        <CardHeader>
                          <CardTitle>Appointment with Dr. {doctor?.doctorName || 'Unknown'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center mb-2">
                            <Calendar className="mr-2" size={16} />
                            <p>{appointment.schedule}</p>  
                          </div>    
                          <div className="flex items-center mb-2">
                            <User className="mr-2" size={16} />
                            <p><strong>Reason:</strong> {appointment.reason}</p>
                          </div>
                          <div className="flex items-center mb-2">
                            <CheckCircle2 className="mr-2" size={16} />
                            <p><strong>Status:</strong> <span className="inline-block ml-2 px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs md:text-sm font-medium"> {appointment.status}</span> </p>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className='flex items-center '>
                              <Tag className="mr-2" size={16} />
                              <p><strong>Appointment ID:</strong> <span className=" ml-2 bg-gray-900/50 px-2 py-1 rounded text-sm md:text-sm break-all">{appointment.$id}</span></p> 
                            </div>
                            <button className='bg-blue-800 rounded-lg px-10 py-1'
                            onClick={() => handleCancelAppointment(appointment.$id)} // Call the cancel function
                            >Cancel</button>

                          </div>                          
                        </CardContent>  
                      </Card>  
                    )    
                  }) 
                ) : (
                  <p>No appointments found.</p>
                )} 
              </ScrollArea>
            </TabsContent>

            <TabsContent value="coupons" className="space-y-4">
              <ScrollArea className="h-[600px] w-full rounded-md border border-gray-700 p-4">
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <Card key={coupon.id} className="mb-4 bg-gray-800 text-white flex justify-between items-center">
                      <CardHeader className="flex-1">
                        <CardTitle>{coupon.partner}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="flex items-center mb-2">
                          <Tag className="mr-2" size={16} />
                          <p><strong>Code:</strong> {coupon.code}</p>
                        </div>
                        <p className="mb-2">{coupon.description}</p>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                          <a href={coupon.link} target="_blank" rel="noopener noreferrer">Redeem</a>
                        </Button>
                      </CardContent>
                      {/* Add the image on the right side */}
                      <div className="flex-shrink-0">  
                        <Image 
                          src="/assets/icons/logo-doctorsclub.svg"
                          width={82}  
                          height={66}
                          alt="DoctorsClub Logo"
                          className="h-[76px] w-[82px] md:h-[92px] md:w-[102px] object-contain"
                          priority 
                        />
                      </div>
                    </Card>
                  ))
                ) : (
                  <p>No coupons available.</p>
                )}
              </ScrollArea>
            </TabsContent>
            
          </Tabs>
        </div>
      </main> 

    </div>  
    <Footer /> 
  </div>
  )
} 