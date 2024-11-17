// components/DoctorModal.tsx

import React from 'react';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  doctorName: string;  
  specialty: string;
  email: string;
}

interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
}

const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, onClose }) => {
  const router = useRouter();

  const handleBooking = () => {
    if (doctor) {
      router.push(`/appointment?doctorId=${doctor.id}`); // Use doctor ID in the URL
      onClose();
    }
  };

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
        <h2 className="text-xl font-bold">{doctor.doctorName}</h2>
        <p><strong>Specialty:</strong> {doctor.specialty}</p>
        <p><strong>Clinic:</strong> {doctor.clinicName}</p>
        <p><strong>Address:</strong> {doctor.clinicAddress}</p>
        <p><strong>Phone:</strong> {doctor.clinicPhone}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={handleBooking}
        >
          Book Now
        </button>
        <button className="mt-2 text-red-500" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DoctorModal;   