"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { motion } from "framer-motion";
import { ConfettiButton } from "@/components/ui/confetti";
import Image from 'next/image';
import { CheckCircle, Gift, CalendarCheck, Copy, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Models } from "node-appwrite";  
import dynamic from "next/dynamic";
import { StarsBackground } from "@/components/ui/stars-background";

type Coupon = {
  name: string;
  code?: string;
  link?: string;
  description: string;
};


const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [appointmentDetails, setAppointmentDetails] = useState<Models.Document | null>(null);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  
  const appointmentId = searchParams.get("appointmentId");
  const router = useRouter();

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        console.error("No appointment ID available in URL");
        return;
      }

      try {
        const appointment = await getAppointment(appointmentId);
        setAppointmentDetails(appointment);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // const copyToClipboard = (code: string, index: number) => {
  //   navigator.clipboard.writeText(code);
  //   setCopiedCode(index);
  //   setTimeout(() => setCopiedCode(null), 2000);
  // };

  const copyToClipboard = (code: string | undefined, index: number) => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(index);   
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      console.warn("No code available to copy");
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-black flex items-center justify-center">
  //       <StarsBackground />
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
  //       <div>
  //        <p className="ml-6 font-semibold animate-pulse text-lg">✨ The stars are aligning... hang tight!</p>
  //       </div>  
  //     </div>
        
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <StarsBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-6 font-semibold text-xs sm:text-sm md:text-xl lg:text-2xl animate-pulse text-center sm:text-left">
             ✨ The stars are aligning... hang tight!
          </p>
        </div>   
    );
  }


  if (!appointmentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <p className="text-xl md:text-2xl font-semibold text-gray-300 text-center">No appointment details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
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

        <main className="px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Success Header */}
            <div className="text-center mt-8 md:mt-12 mb-6 md:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="inline-block"
              >
                <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Appointment Confirmed!</h1>
              <ConfettiButton className="bg-blue-600 mt-2 text-white px-4 md:px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm md:text-base">
                🎉 Celebrate!
              </ConfettiButton>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-6 md:mt-8"
              >
                <button
                  onClick={() => router.push("/patients/dashboard")}
                  className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm text-gray-300 py-2 px-4 rounded-full hover:bg-gray-700 transition-all shadow-sm text-sm md:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </motion.div>
            </div>

            {/* Appointment Details Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                <h2 className="text-xl md:text-2xl font-semibold text-white">Appointment Details</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm md:text-base">
                  Appointment ID: 
                  <span className="font-mono ml-2 bg-gray-900/50 px-2 py-1 rounded text-xs md:text-sm break-all">{appointmentId}</span>
                </p>
                <p className="text-gray-300 text-sm md:text-base">
                  Doctor: 
                  <span className="font-semibold text-white ml-2">Dr. {appointmentDetails.primaryPhysician}</span>
                </p> 
                <p className="text-gray-300 text-sm md:text-base">
                  Schedule: 
                  <span className="font-semibold text-white ml-2">{new Date(appointmentDetails.schedule).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}</span>
                </p>
                <p className="text-gray-300 text-sm md:text-base">
                  Reason: 
                  <span className="font-semibold text-white ml-2">{appointmentDetails.reason}</span>
                </p>
                <p className="text-gray-300 text-sm md:text-base">
                  Note: 
                  <span className="font-semibold text-white ml-2">{appointmentDetails.note}</span>
                </p>
                <p className="text-gray-300 text-sm md:text-base">
                  Status: 
                  <span className="inline-block ml-2 px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs md:text-sm font-medium">
                    {appointmentDetails.status}
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Patient Details Card */}
            {appointmentDetails.patient && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 border border-gray-700"
              >
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Patient Details</h3>
                <p className="text-gray-300 text-sm md:text-base">
                  Name: <span className="font-semibold text-white">{appointmentDetails.patient.name}</span>
                </p>
              </motion.div>
            )}

            {/* Coupons Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                <h2 className="text-xl md:text-2xl font-semibold text-white">Exclusive Coupons</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {appointmentDetails.coupons?.map((coupon : Coupon, index : number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative bg-gray-800/80 rounded-xl shadow-lg overflow-hidden border border-gray-700"
                  > 
                    <div className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold text-base md:text-lg text-white">{coupon.name}</h3>
                        <div className="bg-blue-900/50 text-blue-400 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          Exclusive
                        </div> 
                      </div>
                       
                      <p className="text-gray-300 text-sm md:text-base mb-4">{coupon.description}</p>
                      
                      {coupon.code && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between bg-gray-900/50 p-2 md:p-3 rounded-lg">
                            <code className="font-mono text-xs md:text-sm font-medium text-white">
                              {coupon.code}
                            </code> 
                            <button
                              onClick={() => copyToClipboard(coupon.code ??"", index)}
                              className="text-blue-400 hover:text-blue-300 focus:outline-none"
                            >
                              {copiedCode === index ? (
                                <span className="text-green-400 text-xs md:text-sm">Copied!</span>
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>  
                        </div>
                      )}
                      
                      {coupon.link && (
                        <a
                          href={coupon.link}
                          className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors text-sm md:text-base"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Redeem 
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      <section className="mt-8 md:mt-16">   
        <Footer />
      </section>
    </div>
  );
};

export default ConfirmationPage;