"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Clerk user data after authentication
import { toast } from "react-toastify";
import { addDoctor } from "@/lib/actions/doctor.actions"; // Your Appwrite action
import Image from "next/image";
import { IoMdSend } from "react-icons/io";  
import { CircularProgress } from "@mui/material";      
import { sendGTMEvent } from "@next/third-parties/google";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useUser(); // Get Clerk authenticated user data

  const [formData, setFormData] = useState({
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    doctorName: "",
    specialty: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.clinicName ||
      !formData.clinicAddress ||
      !formData.clinicPhone ||
      !formData.doctorName ||
      !formData.specialty
    ) {
      toast.error("Please fill out all the fields.");
      return; // Stop form submission if any field is empty
    }

    setLoading(true);

    try {
      const doctorData = {
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        clinicPhone: formData.clinicPhone,
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        email:
          typeof user?.primaryEmailAddress === "string"
            ? user?.primaryEmailAddress
            : user?.primaryEmailAddress?.emailAddress || "", // Ensure it's a string
        doctorId: user?.id || "",
      };

      await addDoctor(doctorData); // Call Appwrite action to add doctor profile  

      toast.success("Registration successful!");
      router.push("/admin"); // Redirect after successful registration
    } catch (error) {
      console.error("Error creating doctor profile:", error);
      toast.error("Registration failed. Please try again.");
    } finally{
      setLoading(false); 
    }
  }; 

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
      {/* Logo positioned with added spacing */}
      <div className="absolute top-0 left-0 md:top-4 md:left-4">
        <Image
          src="/assets/icons/logo-doctorsclub.svg"
          alt="Company Logo"
          width={100}
          height={50}
          priority 
        />
      </div>

      {/* Added margin for space between logo and form */}
      <div className="w-full mt-20 max-w-lg p-8 bg-white border-t border-l rounded-lg shadow-lg border-b-4 border-r-4 border-black md:max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Complete Your Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="doctorName"
                className="block mb-2 font-semibold text-black"
              >
                Doctor Name
              </label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                required
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
                aria-describedby="doctorNameHelp"
              />
            </div>

            <div>
              <label
                htmlFor="specialty"
                className="block mb-2 font-semibold text-black"
              >
                Specialty
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
                aria-describedby="specialtyHelp"
              />
            </div>

            <div>
              <label
                htmlFor="clinicName"
                className="block mb-2 font-semibold text-black"
              >
                Clinic Name
              </label>
              <input
                type="text"
                id="clinicName"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                required
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
                aria-describedby="clinicNameHelp"
              />
            </div>

            <div>
              <label
                htmlFor="clinicAddress"
                className="block mb-2 font-semibold text-black"
              >
                Clinic Address
              </label>
              <input
                type="text"
                id="clinicAddress"
                name="clinicAddress"
                value={formData.clinicAddress}
                onChange={handleChange}
                required
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
                aria-describedby="clinicAddressHelp"
              />
            </div>

            <div>
              <label
                htmlFor="clinicPhone"
                className="block mb-2 font-semibold text-black"
              >
                Clinic Phone
              </label>
              <input
                type="text"
                id="clinicPhone"
                name="clinicPhone"
                value={formData.clinicPhone}
                onChange={handleChange}
                required
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
                aria-describedby="clinicPhoneHelp"
              />   
            </div>
          </div>

          <button
             onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'Register' })} 
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center p-4 rounded-lg font-semibold ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 text-white hover:bg-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border-t border-l border-b-4 border-r-4 border-gray-900`}
          >
            {loading ? (
              <>
                <CircularProgress size={24} className="mr-3" /> Submitting...
              </>
            ) : (
              <>
                <span className="flex-grow">Submit</span>
                <IoMdSend className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form> 
      </div>
    </div>
  );
}