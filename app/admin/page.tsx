"use client";

import { useEffect, useState } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary'; 
import Image from 'next/image';
import Link from 'next/link';
import AddPatientDialog from '@/components/AddPatientDialog';
import { DataTable } from '@/components/table/DataTable';
import { patientColumns } from '@/components/table/patientColumns';
import { appointmentColumns } from '@/components/table/appointmentColumns'; // New column for appointments
import { getTodayPatients, getAllPatients } from '@/lib/actions/patient.actions';
import { getAllAppointment } from '@/lib/actions/appointment.actions'; // Import the appointment fetching function
import { FaHistory, FaCalendarDay, FaChartBar } from 'react-icons/fa';
import { BarChartWithLabel } from '@/components/charts/BarChartWithLabel';
import { LineChartWithLabel } from '@/components/charts/LineChartWithLabel';
import { PieChartWithLabel } from '@/components/charts/PieChartWithLabel';  
import { IconSearch } from '@tabler/icons-react';   
import { getDoctorById, updateDoctorImage } from '@/lib/actions/doctor.actions';

type CloudinaryUploadResult = {
  info?: {
    secure_url?: string;
    public_id?: string;
    [key: string]: any;
  } | string;  
};

const POLLING_INTERVAL = 11000; // Polling interval in milliseconds (11 seconds);

const Admin = () => {
  const { userId } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAppointments, setShowAppointments] = useState(true);
  const [showManageProfile, setShowManageProfile] = useState(false);
  const [doctorImage, setDoctorImage] = useState<URL | null>(null);

  const doctorId = userId ?? '';

  const fetchPatients = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const fetchedPatients = showHistory
        ? await getAllPatients(userId)
        : await getTodayPatients(userId);

      setPatients(fetchedPatients.documents);
      setFilteredPatients(fetchedPatients.documents);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!userId) {
        return;
      } else {
        const fetchedAppointments = await getAllAppointment(userId);
        setAppointments(fetchedAppointments);
        setFilteredAppointments(fetchedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {  
    fetchAppointments();

    const interval = setInterval(() => {
      fetchAppointments();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [userId, showHistory]);  // used for auto refresh fetching

  useEffect(() => {   
    fetchPatients();
    // fetchAppointments(); // used for manual refresh 
  }, [userId, showHistory]);


  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPatients(patients);
      setFilteredAppointments(appointments);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
      setFilteredPatients(filtered);

      const filteredApps = appointments.filter(appointment =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.schedule.includes(searchTerm)
      );
      setFilteredAppointments(filteredApps);
    }
  }, [searchTerm, patients, appointments]);

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (userId) {
        try {
          const doctor = await getDoctorById(userId);
          setDoctorName(doctor.doctorName);
        } catch (error) {
          console.error("Error fetching doctor details:", error);
        }
      }
    };

    fetchDoctorName();
  }, [userId]);

  useEffect(() => {
    const handlePatientAdded = () => {
      fetchPatients();
    };

    window.addEventListener('patientAdded', handlePatientAdded as EventListener);

    return () => { 
      window.removeEventListener('patientAdded', handlePatientAdded as EventListener);
    };
  }, [userId, showHistory]);   

  const handleImageUpload = async (results: CloudinaryUploadResult) => {
    // Ensure info is defined and is not a string
    if (results?.info && typeof results.info !== 'string' && userId) {
      const secureUrl = results.info.secure_url;
  
      if (secureUrl) {
        try {
          const imageUrl = new URL(secureUrl);
          await updateDoctorImage(userId, imageUrl.toString());
          setDoctorImage(imageUrl);
        } catch (error) {
          console.error('Error updating doctor image:', error);
        }
      } else {
        console.error('secure_url is missing in the upload results');
      }
    } else {
      console.error('Upload results are invalid or missing information');
    }
  };

  return (
    <div className="mx-auto max-w-full flex flex-col space-y-14 px-4 md:px-8 lg:px-12">
      <header className="admin-header flex flex-row md:flex-row md:justify-between md:items-center">
        <Link href='/' className="cursor-pointer flex items-center mb-4 md:mb-0">
          <Image
            src="/assets/icons/logo-doctorsclub.svg"
            height={92}  
            width={112}
            alt="logo"
            className="h-25 w-55"
          />
        </Link>

        <div className="flex flex-row md:flex-row md:items-center md:space-x-4">
          <p className="text-lg font-semibold mr-4 text-center md:text-left">Dr. {doctorName}</p>
          <UserButton />    
          {doctorImage && (
            <Image
              src={doctorImage.toString()} // Convert URL object to string when rendering
              height={110}
              width={90}
              alt="Doctor Profile"  
              className="rounded-full" 
            /> 
          )}   
          <CldUploadWidget
            uploadPreset="next_cloudinary_app"
            onSuccess={handleImageUpload}  
          >         
            {({ open }) => ( 
              <button onClick={() => open()} className="bg-blue-800 text-white text-lg px-2 py-2 rounded-full">
                Upload Image 
              </button>   
            )}
          </CldUploadWidget>
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <input   
                type="text"   
                placeholder="Search " 
                value={searchTerm}   
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 pl-10 border rounded-md focus:outline-none w-full" 
              />
              <IconSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            <div className="flex flex-row space-x-4">
              {userId && <AddPatientDialog doctorId={userId} />} 
              <button
                className="btn btn-secondary flex items-center space-x-2 md:mb-0"
                onClick={() => setShowAppointments(prev => !prev)}
              >
                {showAppointments ? (
                  <>
                    <FaCalendarDay className="text-xl" />
                    <span>Show Patients</span>
                  </>
                ) : (
                  <>
                    <FaCalendarDay className="text-xl" />
                    <span>Show Appointments</span>
                  </>
                )}
              </button>
              <button
                className="btn btn-secondary flex items-center space-x-2"
                onClick={() => setShowInsights(prev => !prev)}
              >
                <FaChartBar className="text-xl" />
                <span>{showInsights ? 'Show List' : 'Show Insights'}</span>
              </button> 
            </div>  
          </div>
        </section>

        {/* {showManageProfile && (
        <ManageProfileDialog doctorId={doctorId} onClose={() => setShowManageProfile(false)} />
      )}   */}

        <section className="w-full space-y-4">
          {showInsights ? (
            <>
              <h2 className="text-xl md:text-2xl mt-4 mb-4 md:mb-8 font-semibold">Patient Insights</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div>
                  {userId && <BarChartWithLabel doctorId={userId} />}
                </div>
                <div>
                  {userId && <LineChartWithLabel doctorId={userId} />}
                </div>
              </div>
              <div className="flex justify-center">
                {userId && <PieChartWithLabel doctorId={userId} />}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl mt-4 mb-4 md:mb-8 font-semibold">
                {showAppointments ? 'Appointments List' : 'Patient List'}
              </h2>
              <div className="overflow-x-auto">
                {showAppointments ? (
                  <DataTable columns={appointmentColumns} data={filteredAppointments} />
                ) : (
                  <DataTable columns={patientColumns} data={filteredPatients} />  
                )}
              </div>
            </>  
          )}  
        </section>
      </main>
    </div>
  );
};

export default Admin;    