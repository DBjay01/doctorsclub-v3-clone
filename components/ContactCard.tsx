"use client";

import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export function ContactCard() {
  return (
    <div className="flex flex-col items-start justify-start p-4 sm:p-6 md:p-8 lg:p-10 bg-black border border-neutral-800 rounded-lg shadow-lg w-full max-w-full sm:max-w-md md:max-w-lg mx-auto space-y-4 sm:space-y-6">
      <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-5">
        Need help? Feel free to contact us
      </h2>
      <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5">
        Have an issue or feedback for us? Our support team is here to help you.
      </p>
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center space-x-4 sm:space-x-5">
          <FaEnvelope className="text-white h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
          <p className="text-white text-sm sm:text-base md:text-lg">contact@bydoctorsclub.com</p>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-5">
          <FaPhone className="text-white h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
          <p className="text-white text-sm sm:text-base md:text-lg">+91 87673-95954</p>    
        </div>

        <div className="flex items-center space-x-4 sm:space-x-5">
          <FaMapMarkerAlt className="text-white h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10" />
          <p className="text-white ml-4 text-sm sm:text-base md:text-lg">
            B803, Aishwaryam Courtyard Phase 2, Opp Ganesh International School, Newalewasti, Chikhali, Chinchwad, Pune
          </p>
        </div>     
      </div>
    </div>
  );
}     