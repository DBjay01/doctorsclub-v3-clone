"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from 'next/image'
import { Calendar, Clock, MessageSquare, NotebookText, UserCircle } from "lucide-react";
import { fetchPatientData } from "@/lib/actions/patient.actions";
import { createAppointment } from "@/lib/actions/appointment.actions";
import Link from "next/link";  
import dynamic from "next/dynamic";
import { StarsBackground } from "@/components/ui/stars-background";

const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false }); 

const AppointmentPage = () => {    
  const router = useRouter();
  const { userId } = useAuth();
  const searchParams = useSearchParams();

  const doctorName = searchParams.get("doctorName") || "";
  const doctorId = searchParams.get("doctorId") || "";

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(formatDate(today));
  const [time, setTime] = useState("09:00 AM");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [userName, setUserName] = useState("");
  const [morningSlots, setMorningSlots] = useState<string[]>([]);
const [eveningSlots, setEveningSlots] = useState<string[]>([]);


  // Generate time slots for morning (9 AM to 1 PM) and evening (5 PM to 9 PM)
  useEffect(() => {
    const generateTimeSlots = (startHour: number, endHour: number) => {
      const slots = [];
      const time = new Date();   
      time.setHours(startHour, 0, 0);
      const end = new Date();
      end.setHours(endHour, 0, 0);

      while (time < end) {
        const hour = time.getHours();  
        const minutes = time.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const timeString = `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        slots.push(timeString);
        time.setMinutes(time.getMinutes() + 10);
      } 
      return slots;
    };

    setMorningSlots(generateTimeSlots(9, 13)); // 9 AM to 1 PM
    setEveningSlots(generateTimeSlots(17, 21)); // 5 PM to 9 PM
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userData = await fetchPatientData(userId);
          setUserName(userData.name);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      console.error("User is not signed in.");
      return;
    }

    try {
      // Convert 12-hour format to 24-hour format for backend
      const [timeStr, period] = time.split(' ');
      const [hours, minutes] = timeStr.split(':');
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;

      const appointmentId = await createAppointment({
        userId,
        doctorId,
        primaryPhysician: doctorName,
        status: "scheduled",
        schedule: `${date}T${time24}`,
        reason,
        note,
      });
      router.push(`/appointment/confirmation?appointmentId=${appointmentId}`);
    } catch (error) {
      console.error("Failed to book appointment:", error);
    }
  };

   

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };
 
  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      <StarsBackground />  
      <div className="relative z-10">
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
        
      <main>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto py-10 px-4"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-white text-center">Book an Appointment</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="patientName" className="block text-sm font-medium text-white">
                    Patient Name
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      id="patientName"
                      type="text"
                      value={userName || ""}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="doctorName" className="block text-sm font-medium text-white">
                    Doctor Name
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      id="doctorName"
                      type="text" 
                      value={`Dr. ${doctorName}`}   
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div> 

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-white">
                    Appointment Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      id="appointmentDate"
                      type="date"
                      value={date}
                      min={formatDate(today)}
                      max={formatDate(maxDate)}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    /> 
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-white">
                    Appointment Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <select
                      id="appointmentTime"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <optgroup label="Morning Slots (9 AM - 1 PM)" className="text-gray-900">
                        {morningSlots.map((slot) => (
                          <option key={slot} value={slot} className="text-gray-900">
                            {slot}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Evening Slots (5 PM - 9 PM)" className="text-gray-900">
                        {eveningSlots.map((slot) => (
                          <option key={slot} value={slot} className="text-gray-900">
                            {slot}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                <label htmlFor="appointmentReason" className="block text-sm font-medium text-white">
                  Reason for Appointment
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 text-blue-400" />
                  <textarea
                    id="appointmentReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please describe your reason for the appointment."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-2">
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-white">
                  Additional Notes
                </label>
                <div className="relative">
                  <NotebookText className="absolute left-3 top-4 text-blue-400" />
                  <textarea
                    id="additionalNotes"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any additional information you'd like to share."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <button
                type="submit"
                className="w-full bg-blue-700 text-white font-semibold py-4 rounded-lg hover:bg-blue-400 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900"
              >
                Confirm Appointment
              </button> 
            </motion.div>  
          </form>
        </div> 
      </motion.div>
      </main>
  
        {/* <Footer />    */}
    </div> 
    <Footer />
  </div> 
  );   
}; 

export default AppointmentPage;   