"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import Image from "next/image";  
import { IoMdSend } from "react-icons/io";
import { CircularProgress } from "@mui/material";
import { sendGTMEvent } from "@next/third-parties/google";
import { registerPatient } from "@/lib/actions/patient.actions";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";  
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RegisterPage() {

  const router = useRouter();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    address: "",  
    allergies: "",
    phone: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    if (value) {
      // Extract numeric part
      const numericValue = value.replace(/\D/g, '');

      // Allow only 10 digits
      if (numericValue.length <= 12) {
        setFormData({
          ...formData,
          phone: value,
        });
      }
    } else {
      // Clear the phone number when input is empty
      setFormData({
        ...formData,
        phone: "",
      });  
    }  
  };
  
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  

    if (!formData.name || !formData.address  || !formData.phone || !formData.gender ) {
      toast.error("Please fill out all the fields.");
      return;  
    }

    setLoading(true);

    try { 
      const patientData = {
        ...formData,
        userId: user?.id || "",
      };

      await registerPatient(patientData);

      toast.success("Registration successful!");  
      router.push("/patients/dashboard");
    } catch (error) {
      console.error("Error creating patient profile:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
      <div className="absolute top-0 left-0 md:top-4 md:left-4">
        <Image
          src="/assets/icons/logo-doctorsclub.svg"
          alt="Company Logo"
          width={100}
          height={50}
          priority
        />
      </div>

      <div className="w-full mt-20 max-w-lg p-8 bg-white border-t border-l rounded-lg shadow-lg border-b-4 border-r-4 border-black md:max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Complete Your Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold text-black">
                Name
              </label>
              <input
                type="text"
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
              />
            </div>

            {/* Address Input */}
            <div>
              <label htmlFor="address" className="block mb-2 font-semibold text-black">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}  
                required
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <label htmlFor="phoneNumber" className="block mb-2 font-semibold text-black">
                Phone Number
              </label>
              <PhoneInput
                defaultCountry="IN"
                value={formData.phone}
                onChange={handlePhoneNumberChange}
                className="w-full p-3 border-t border-l rounded-lg bg-white text-white border-b-4 border-r-4 border-gray-900"
              
              />  
            </div>

            {/* Gender Radio Buttons */}
            <div>
              
                <FormLabel className="text-black font-semibold">
                  Gender
                </FormLabel>
                <RadioGroup   
                  row  
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="text-black font-semibold"
                >
                  <FormControlLabel className="text-black" value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              
            </div> 


            {/* Allergies Input */}
            <div>
              <label htmlFor="allergies" className="block mb-2 font-semibold text-black">
                Allergies (if any)
              </label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full p-3 border-t border-l rounded-lg bg-white text-black border-b-4 border-r-4 border-gray-900"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => sendGTMEvent({ event: "buttonClicked", value: "Register" })}
            type="submit" 
            disabled={loading}
            className={`w-full flex items-center justify-center p-4 rounded-lg font-semibold ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 text-white hover:bg-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border-t border-l border-b-4 border-r-4 border-gray-900`}
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