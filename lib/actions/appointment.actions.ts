"use server"; 

import { ID, Models, Query } from "node-appwrite";
import { toZonedTime, format } from 'date-fns-tz';
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging, PATIENT_COLLECTION_ID } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
// import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { sub } from "date-fns";

interface Patient {
  name: string;
  email: string;
  // Add more fields as necessary
}

interface Appointment {
  primaryPhysician: string; 
  schedule: string;
  reason: string;
  patient: Patient;  
}

interface AppointmentDocument {
  userId: string;
  coupons: string;
  // Other fields based on your schema
}

const allCoupons = [
  {
    id: 1,
    name: "Pharmeasy - Flat 24% Off on Medicines",
    code: "AFADM24",
    link: "https://bitli.in/ogAv8eB",
    description: "Pharmeasy Get Flat 24% Off on Medicines Using Code: AFADM24",
  },
  {
    id: 2,
    name: "Pharmeasy - Flat 20% Off on first 3 orders",
    code: "AF20",
    link: "https://bitli.in/ogAv8eB",
    description: "Pharmeasy Flat 20% Off your 1st three Medicine Order over Rs 999",
  },
  {
    id: 3,
    name: "Truemeds - Flat 25% Off for New Users",
    code: "CK25",
    link: "https://bitli.in/xbejYP5",
    description: "Get Flat 25% Off on Orders Above Rs 1399 (New Users Only)",
  },
  {
    id: 4,
    name: "Minimalist - Flat 5% Off",
    code: "EK5",
    link: "https://bitli.in/ZtI2T63",
    description: "Get Flat 5% Off Code | Use Code: 'EK5'",
  },
  {
    id: 5,
    name: "The Ayurveda Company - Explore Ayurveda Products",
    link: "https://bitli.in/D6ts8mn",
    description: "Skincare and Lifestyle Products based on Ayurveda & Modern Science",
  },
  {
    id: 6,
    name: "Beardo - Flat 20% Off Sitewide",
    code: "BEARDO20",
    link: "https://bitli.in/6K4JnCY",
    description: "Exclusive selection of hair, beard, moustache, skin & face products.",
  },
  {
    id: 7,
    name: "Clovia - Rs 300 Off on Orders above Rs 1299",
    code: "CLOVIA300",
    link: "https://bitli.in/Wyeq2Sw",
    description: "Rs 300 Off on Orders above Rs 1299 | Use Code: CLOVIA300",
  },
  {
    id: 8,
    name: "Wow Science - 15% Off Sitewide",
    code: "WOW15",    
    link: "https://bitli.in/mr1nCEw",
    description: "Get 15% Off sitewide | Use Code: WOW15",
  }, 
  {
    id: 9,
    name: "Nature Derma - Flat 10% Off",
    code: "ND10",
    link: "https://bitli.in/nuk1xDP",
    description: "Get Flat 10% Off on Select Products", 
  },
  {
    id: 10,
    name: "MamaEarth - Flat Rs 500 Cashback",
    code: "FLAT500",
    link: "https://bitli.in/elNNfHp",
    description: "Shop for Rs 999 And get Flat Rs 500 Cashback",
  },
  {
    id: 11,
    name: "Blue Tea - Flat Rs 100 Cashback",
    code: "TEATIME100",
    link: "https://bitli.in/d5XIQiw",
    description: "Get Flat Rs 100 off on orders above RS 799",
  },
];

let usedPharmeasyCoupons: Set<number> = new Set();

const selectRandomCoupons = () => {
  // Filter Pharmeasy and non-Pharmeasy coupons
  const pharmeasyCoupons = allCoupons.filter(
    (coupon) => coupon.name.toLowerCase().includes("pharmeasy") && !usedPharmeasyCoupons.has(coupon.id)
  );
  const nonPharmeasyCoupons = allCoupons.filter(
    (coupon) => !coupon.name.toLowerCase().includes("pharmeasy")
  );

  const selectedCoupons: typeof allCoupons[0][] = [];

  // Check if there are any Pharmeasy coupons left to select
  if (pharmeasyCoupons.length > 0) {
    const selectedPharmeasy = pharmeasyCoupons[Math.floor(Math.random() * pharmeasyCoupons.length)];
    selectedCoupons.push(selectedPharmeasy);
    usedPharmeasyCoupons.add(selectedPharmeasy.id);
  }

  // Randomly select additional coupons from non-Pharmeasy coupons
  while (selectedCoupons.length < 3) {
    const randomCoupon = nonPharmeasyCoupons[Math.floor(Math.random() * nonPharmeasyCoupons.length)];
    if (!selectedCoupons.includes(randomCoupon)) {
      selectedCoupons.push(randomCoupon);
    }
  }

  return selectedCoupons;
};

// Function to serialize coupons into a string
const serializeCoupons = (coupons: any[]) => {
  return coupons.map(coupon =>     
    `${coupon.id}|${coupon.name}|${coupon.code || ''}|${coupon.link}|${coupon.description}`
  ).join(';');
}; 

// Function to deserialize coupons from a string
const deserializeCoupons = (couponsString: string) => {
  if (!couponsString) return [];

  return couponsString.split(';').map((couponString) => {
    const [id, name, code, link, description] = couponString.split('|');
    return {
      id: parseInt(id, 10),
      name,
      code: code || null,
      link,
      description,
    };
  }); 
};

const convertToUTC = (localDatetime: string, timezone: string = 'Asia/Kolkata'): string => {
  const localDate = new Date(localDatetime);  // Create the date from local string
  // const utcDate = toZonedTime(localDatetime, timezone);  // Convert to specific timezone (Asia/Kolkata)
  return localDate.toISOString();  // Convert to UTC format before storing
};  

// Convert UTC back to local time when fetching
const convertToLocalTime = (utcDatetime: string, timezone: string = 'Asia/Kolkata'): string => {
  const utcDate = new Date(utcDatetime); // Convert UTC to Date object
  // const localDatetime = toZonedTime(utcDatetime, timezone); // Convert to Asia/Kolkata
  return format(utcDate, 'yyyy-MM-dd HH:mm:ss');   
};    

// Function to convert local time to UTC
export const createAppointment = async (appointmentData: any) => {
  try {
    // const utcSchedule = convertToUTC(appointmentData.schedule);

    const selectedCoupons = selectRandomCoupons();
    const serializedCoupons = serializeCoupons(selectedCoupons);

    const appointmentWithCoupons = {
      ...appointmentData,
      schedule: appointmentData.schedule,                            //utcSchedule, earlier instead of appointmentData.schedule
      coupons: serializedCoupons,
    };

    const response = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointmentWithCoupons
    );

    return response.$id;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    if (response.schedule) {
      response.schedule = convertToLocalTime(response.schedule);
      // response.schedule; 
    }

    if (response.coupons) {
      response.coupons = deserializeCoupons(response.coupons);
    }

    return response;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }   
};  
 
export const createAppointmentss = async (appointmentData: any) => {
  try {
    const response = await databases.createDocument(   
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(), // Automatically generate a unique document ID
      appointmentData   
    );

    // Return the document ID (appointmentId) as a string
    return response.$id;  
  } catch (error) { 
    console.error("Error creating appointment:", error);
    throw error;
  }
};   

export const getAppointmentss = async (appointmentId: string) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!, 
      appointmentId,
        
    );
    return response;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};               //////working codesssss ;)))

export const createAppointments = async ( appointment: CreateAppointmentParams  ) => {

    try {
      const newAppointment = await databases.createDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        ID.unique(),
        appointment
      );
  
      return parseStringify(newAppointment);

    } catch (error) {
      console.error(error);   
    }
};
  
export const getAppointments = async (appointmentId : string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId, 
    );

    return  parseStringify(appointment);   
  } catch (error) {
    console.log(error)
  }
}  

// export const getRecentAppointmentList = async () => {
//   try {
//     const appointments = await databases.listDocuments(
//       DATABASE_ID!,
//       APPOINTMENT_COLLECTION_ID!,
//       [Query.orderDesc("$createdAt")]  
//     );  

//     const initialCounts = {   
//       scheduledCount: 0,
//       pendingCount: 0,
//       cancelledCount: 0,
//     };

//     const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
//       if(appointment.status === 'scheduled'){
//         acc.scheduledCount += 1;
//       } else if (appointment.status === 'pending'){
//         acc.pendingCount += 1;
//       } else if (appointment.status === 'cancelled'){
//         acc.cancelledCount += 1;
//       }

//       return acc;
//     }, initialCounts);    

//     const data = {
//       totalCount: appointments.total,
//       ...counts,
//       documents: appointments.documents,
//     };  

//     return parseStringify(data);  
//   } catch (error) {
//     console.log(error)
//   } 
// }

export const updateAppointment = async ({ appointmentId, userId, appointment, type } : UpdateAppointmentParams ) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,  
      appointment,  
    );

    if (!updatedAppointment) throw Error;  

    const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    await sendSMSNotification(userId, smsMessage); 

    revalidatePath('/admin');
    return parseStringify(updateAppointment); 
  } catch (error) {
    console.log(error)
  }
}

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content, 
      [],
      [userId]  
    )
  } catch (error) {
    
  }
} 

export const getAppointmentWithPatient = async (appointmentId: string): Promise<Appointment> => {
  try {
    // Fetch the appointment document
    const appointmentDoc = await databases.getDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId) as Models.Document;

    // Fetch the patient document if the relationship exists
    const patientDoc = await databases.getDocument(DATABASE_ID!, PATIENT_COLLECTION_ID!, appointmentDoc.patient) as Models.Document;

    // Manually map the document fields to the Appointment type
    const appointment: Appointment = { 
      primaryPhysician: appointmentDoc.primaryPhysician,
      schedule: appointmentDoc.schedule, 
      reason: appointmentDoc.reason,
      patient: {
        name: patientDoc.name,
        email: patientDoc.email  
      }
    };

    return appointment;
  } catch (error) {
    console.error("Error fetching appointment or patient details:", error);
    throw error; 
  }
};

export const getAllAppointments = async (doctorId: string) => {
  try {
    const appointmentsResponse = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("doctorId", doctorId)] // Filter appointments by doctorId
    ); 

    return parseStringify(appointmentsResponse); 
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const getAllAppointmentss = async (doctorId: string) => {
  try {
    // Fetch appointments from the collection using doctor ID as a filter
    const appointmentResponse = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal('doctorId', doctorId)] // Filter by doctorId
    );

    // Log the raw response to check the structure
    console.log("Appointment Response:", appointmentResponse);

    // Safely check if 'documents' exists and is an array, else assign an empty array
    const appointments = appointmentResponse?.documents ?? [];

    // Check if there are no appointments for the doctor
    if (appointments.length === 0) {
      console.log("No appointments found for doctor ID:", doctorId);
      return [];
    }

    // Fetch patient details for each appointment using `listDocuments`
    const appointmentsWithPatientDetails = await Promise.all(
      appointments.map(async (appointment: any) => {
        try {
          // Fetch the patient details using the patientId from the appointment
          const patientResponse = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', appointment.userId)] // Assuming 'userId' is the patient identifier
          );

          // Assuming patientResponse.documents contains a list of patients and we take the first one
          const patient = patientResponse.documents[0];

          // Attach the patient name to the appointment object
          return {
            ...appointment,
            patientName: patient ? patient.name : "Unknown", // Assuming the patient document has a 'name' field
          };
        } catch (patientError) {
          console.error("Error fetching patient details for appointment ID:", appointment.$id, patientError);
          // Return the appointment without patient details if fetching fails
          return appointment;
        }
      })
    ); 

    return appointmentsWithPatientDetails; // Return the enriched appointment list
  } catch (error) {
    console.error("Error fetching appointments:", error);  
    return []; // Return an empty array in case of an error
  }
};

export const getAppointmentsByUserId = async (userId: string) => {
  try {
    const appointmentsResponse = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("userId", userId),
       Query.orderDesc("$createdAt"),  
      ]// Filter appointments by doctorId
    ); 

    return appointmentsResponse.documents;    
  } catch (error) {  
    console.error("Error fetching appointments:", error);
    throw error;
  }
};  

export const getAllAppointmenttt = async (doctorId: string) => {
  try {
    // Fetch appointments from the collection using doctor ID as a filter
    const appointmentResponse = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal('doctorId', doctorId)] // Filter by doctorId
    );

    // Safely check if 'documents' exists and is an array, else assign an empty array
    const appointments = appointmentResponse?.documents ?? []; 

    if (appointments.length === 0) {
      console.log("No appointments found for doctor ID:", doctorId);
      return [];
    }

    // Fetch patient details for each appointment using `listDocuments`
    const appointmentsWithPatientDetails = await Promise.all(
      appointments.map(async (appointment: any) => {
        try {
          // Fetch the patient details using the patientId from the appointment
          const patientResponse = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', appointment.userId)] // Assuming 'userId' is the patient identifier
          );

          // Take the first patient record if available
          const patient = patientResponse.documents[0];

          // Return the enriched appointment object
          return {
            appointmentId: appointment.$id,
            patientName: patient ? patient.name : "Unknown",
            phone: patient ? patient.phone : "N/A",
            schedule: appointment.schedule,
            reason: appointment.reason,
            status: appointment.status,
            primaryPhysician: appointment.primaryPhysician,
            note: appointment.note,
          };
        } catch (patientError) {
          console.error("Error fetching patient details for appointment ID:", appointment.$id, patientError);
          // Return the appointment without patient details if fetching fails
          return {
            appointmentId: appointment.$id,
            patientName: "Unknown",
            phone: "N/A",
            schedule: appointment.schedule,
            reason: appointment.reason,
            status: appointment.status,
            primaryPhysician: appointment.primaryPhysician,
            note: appointment.note, 
          };
        }
      })
    );

    // Log the enriched appointments to verify the structure
    console.log("Enriched Appointments:", appointmentsWithPatientDetails);

    return appointmentsWithPatientDetails;
  } catch (error) {
    console.error("Error fetching appointments:", error);  
    return []; // Return an empty array in case of an error
  }
}; 

export const getAllAppointment = async (doctorId: string) => {  //working  one code
  try {
    // Fetch appointments from the collection using doctor ID as a filter
    const appointmentResponse = await databases.listDocuments(
      DATABASE_ID!,    
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal('doctorId', doctorId),
        Query.orderDesc("$createdAt"),   
      ] // Filter by doctorId

    );

    // Safely check if 'documents' exists and is an array, else assign an empty array
    const appointments = appointmentResponse?.documents ?? []; 

    if (appointments.length === 0) {
      console.log("No appointments found for doctor ID:", doctorId);
      return [];
    }

    // Fetch patient details for each appointment using `listDocuments`
    const appointmentsWithPatientDetails = await Promise.all(
      appointments.map(async (appointment: any) => {
        try {
          // Fetch the patient details using the patientId from the appointment
          const patientResponse = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', appointment.userId),
            Query.orderDesc("$createdAt"), 
            ] 
          );

          // Take the first patient record if available
          const patient = patientResponse.documents[0]; 

          // Return the enriched appointment object
          return {
            appointmentId: appointment.$id,
            patientName: patient ? patient.name : "Unknown",
            phone: patient ? patient.phone : "N/A",
            schedule: convertToLocalTime(appointment.schedule),
            reason: appointment.reason,
            status: appointment.status,
            address: patient ? patient.address : "Pune",
            primaryPhysician: appointment.primaryPhysician,
            note: appointment.note,
          };
        } catch (patientError) {
          console.error("Error fetching patient details for appointment ID:", appointment.$id, patientError);
          // Return the appointment without patient details if fetching fails
          return {
            appointmentId: appointment.$id,
            patientName: "Unknown",
            phone: "N/A",
            schedule: appointment.schedule, 
            reason: appointment.reason,
            status: appointment.status,  
            address: "Pune",  
            primaryPhysician: appointment.primaryPhysician,
            note: appointment.note,   
          };
        }
      })
    );

    // Filter appointments to only include past and today's appointments
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format today's date

    const filteredAppointments = appointmentsWithPatientDetails.filter(appointment => {
      const appointmentDate = new Date(appointment.schedule);
      return appointmentDate.toISOString().split('T')[0] <= todayString; // Only include past and today's appointments
    });

    // Log the enriched appointments to verify the structure
    console.log("Enriched Appointments:", filteredAppointments);

    return filteredAppointments; // Return the filtered appointments
  } catch (error) {   
    console.error("Error fetching appointments:", error);  
    return []; // Return an empty array in case of an error
  }
};

export const getAllAppointmenttttsss = async (doctorId: string) => {
  try {
    // Fetch appointments from the collection using doctor ID as a filter
    const appointmentResponse = await databases.listDocuments(
      DATABASE_ID!,   
      APPOINTMENT_COLLECTION_ID!,
      [ Query.equal('doctorId', doctorId),
        Query.orderDesc("$createdAt"),  
      ] // Filter by doctorId
    );

    // Safely check if 'documents' exists and is an array, else assign an empty array
    const appointments = appointmentResponse?.documents ?? []; 

    if (appointments.length === 0) {
      console.log("No appointments found for doctor ID:", doctorId);
      return [];
    }

    // Fetch patient details for each appointment using `listDocuments`
    const appointmentsWithPatientDetails = await Promise.all(
      appointments.map(async (appointment: any) => {
        try {
          // Fetch the patient details using the patientId from the appointment
          const patientResponse = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [ Query.equal('userId', appointment.userId),
                
            ]    
          );

          // Take the first patient record if available
          const patient = patientResponse.documents[0];

          // Return the enriched appointment object
          return {
            appointmentId: appointment.$id,
            patientName: patient ? patient.name : "Unknown",
            phone: patient ? patient.phone : "N/A",
            schedule: appointment.schedule,
            reason: appointment.reason,
            status: appointment.status,
            primaryPhysician: appointment.primaryPhysician,
            address: patient ? patient.address : "none", 
            note: appointment.note
          };
        } catch (patientError) {
          console.error("Error fetching patient details for appointment ID:", appointment.$id, patientError);
          // Return the appointment without patient details if fetching fails
          return {
            appointmentId: appointment.$id,
            patientName: "Unknown",
            phone: "N/A",
            schedule: appointment.schedule,
            reason: appointment.reason,
            status: appointment.status,
            primaryPhysician: appointment.primaryPhysician,
            address: "none",  
            note: appointment.note, 
          };
        }
      })
    );

    // Current date and time
    const now = new Date();

    // Filter appointments to only include past and today's appointments
    const filteredAppointments = appointmentsWithPatientDetails.map((appointment) => {
      const appointmentDate = new Date(appointment.schedule);

      // Check if the appointment date and time have passed
      if (appointmentDate < now && appointment.status === "scheduled") {
        // Change status to "completed"
        appointment.status = "completed";
      }

      return appointment;
    }).filter((appointment) => {
      const appointmentDate = new Date(appointment.schedule);
      return appointmentDate <= now; // Only include past and today's appointments
    });

    // Log the enriched appointments to verify the structure
    console.log("Enriched Appointments:", filteredAppointments);

    return filteredAppointments; // Return the filtered appointments
  } catch (error) {   
    console.error("Error fetching appointments:", error);  
    return []; // Return an empty array in case of an error
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  try {
    // Update the appointment status to 'cancelled'  
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      { status: "cancelled", cancellationReason: "Cancelled by user" } // Update the status and set a reason
    );

    // Send SMS notification (if required)
    const smsMessage = `Your appointment scheduled for ${formatDateTime(updatedAppointment.schedule).dateTime} has been cancelled.`;
    await sendSMSNotification(updatedAppointment.userId, smsMessage);

    return updatedAppointment;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
};

export const updateAppointmentStatussss = async (appointmentId: string, updates: { status: string; cancellationReason?: string }) => {
  try {
    // Fetch the appointment document by appointmentId  
    const appointment = await getAppointmentById(appointmentId);

    // Use the Appwrite-generated document ID ($id) to update the document
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointment.$id, // Use the document's Appwrite ID here
      {
        status: updates.status,
        cancellationReason: updates.cancellationReason || null // Set to null if not provided
      }
    );

    return updatedAppointment;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export const getAppointmentById = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return appointment;
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    throw error;
  }
};  

// export const getCouponsByUserIdsss = async (userId: string) => {
//   try {
//     // Access the Appwrite database and the appointments collection
//     const response = await databases.listDocuments(
//       DATABASE_ID!,
//       APPOINTMENT_COLLECTION_ID!
//       [
//         Query.equal("userId", userId), // Query for documents where userId matches
//         Query.orderDesc("$createdAt") // Optional: Order by created date, newest first
//       ]
//     );

//     // Find all appointments for this user
//     const appointments = response.documents;

//     // Check if appointments contain coupons
//     const couponsList: string[] = appointments
//       .map((appointment) => appointment.coupons)
//       .filter((coupons) => coupons); // Filter out any undefined/null coupons

//     // If there are coupons, join them into a single string, otherwise return an empty string
//     return couponsList.length > 0 ? couponsList.join(';') : '';
//   } catch (error) {
//     console.error("Error fetching coupons:", error);
//     throw new Error("Unable to fetch coupons.");
//   }
// }; 

// 

export const getCouponsByUserId = async (userId: string) => {
  try {
    // Access the Appwrite database and the appointments collection
    const response = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("userId", userId), // Query for documents where userId matches
        Query.orderDesc("$createdAt") // Optional: Order by created date, newest first
      ]
    );

    // Find all appointments for this user
    const appointments = response.documents;
  
    // Check if appointments contain coupons
    const couponsList: string[] = appointments
      .map((appointment) => appointment.coupons)
      .filter((coupons) => coupons); // Filter out any undefined/null coupons

    // If there are coupons, join them into a single string, otherwise return an empty string
    return couponsList.length > 0 ? couponsList.join(';') : '';
  } catch (error) {
    console.log("Error fetching coupons");
  } 
};

export const cancelAppointmentById = async (appointment: any) => {
  try {
    
    // Update the appointment directly using the appointmentId (which is the document ID in Appwrite)
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,  
      appointment.$id, // Directly use the document ID here
      {
        status: "cancelled"
      }
    );

    return updatedAppointment;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
};

function zonedTimeToUtc(localDatetime: string, timezone: string) {
  throw new Error("Function not implemented.");
}

export const getAppointmentsByUserIds = async (userId: string) => {
  try {
    const appointmentsResponse = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("userId", userId), // Filter by userId
        Query.orderDesc("$createdAt"),  // Order by created date in descending order
      ]
    );

    // Adjust the schedule time for each appointment
    const adjustedAppointments = appointmentsResponse.documents.map(appointment => {
      if (appointment.schedule) {
        const originalDate = new Date(appointment.schedule);
        // const adjustedDate = sub(originalDate, { hours: 5, minutes: 30 });
        appointment.schedule = format(originalDate, "d MMMM yyyy 'at' h:mm a");
      }  
      return appointment; 
    }); 

    return adjustedAppointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};