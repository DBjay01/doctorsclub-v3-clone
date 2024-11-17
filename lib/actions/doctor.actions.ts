"use server";

import { ID, Query } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, databases, DOCTOR_COLLECTION_ID, ENDPOINT, PROJECT_ID, storage } from "../appwrite.config";
import { parseStringify } from "../utils";

interface createDoctorProfile {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;   
  doctorName: string;    
  specialty: string;           
  email: string;
  doctorId: string;
}

export const addDoctor = async ({
  clinicName,
  clinicAddress,
  clinicPhone,
  doctorName,
  specialty,
  email,
  doctorId,
}: createDoctorProfile) => {
  try {
    const newDoctor = await databases.createDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      ID.unique(),
      {
        clinicName,
        clinicAddress,
        clinicPhone,
        doctorName,
        specialty,
        email,
        doctorId,
      }
    );

    return newDoctor ;      
  } catch (error) {
    console.error("Error adding doctor :", error);
    throw error; 
  }
};   


export const getDoctorById = async (doctorId: string) => {
  try {
    const doctor = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      [Query.equal('doctorId', doctorId)]
    );

    if (doctor.total === 0) {
      throw  Error('Doctor not found');
    }

    return doctor.documents[0]; // Assuming doctorId is unique and only one document is returned
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    throw error;
  }
};   

export const getAllDoctors = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!  
    );
 
    if (response.total === 0) {
      throw new Error("No doctors found");  
    }  
 
    return response.documents; // Return all the doctor documents  
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getDoctorsByPage = async (page = 1, limit = 10, searchTerm = '') => {
  try {
    const queryOptions: any = { limit, offset: (page - 1) * limit };
    if (searchTerm) {
      queryOptions.filters = [`doctorName.contains("${searchTerm}")`];
    }   

    const response = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      queryOptions
    );

    if (response.total === 0) {
      throw new Error("No doctors found");
    }

    return response.documents; // Return paginated doctor documents
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getAllDoctorsPaginated = async (page = 1, limit = 9) => {
  try {
    // Calculate the offset based on the page number
    const offset = (page - 1) * limit;

    const response = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,  
      [
        Query.limit(limit), // Set the limit of documents to fetch
        Query.offset(offset), // Skip the documents for previous pages
      ]
    );

    // Return doctors list and total pages based on the total count of documents
    return {
      doctorsList: response.documents,
      totalPages: Math.ceil(response.total / limit),
    };
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};   

export const updateDoctorProfile = async ({
  doctorId,
  doctorName,
  clinicAddress,
  clinicPhone,
  clinicTiming,
  imageFile,
}: {
  doctorId: string;
  doctorName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicTiming: string;
  imageFile?: File; // Accept File directly from an input element
}) => {
  try {
    let file;

    // Check if imageFile is provided
    if (imageFile) {
      // Upload the image file to the storage bucket
      file = await storage.createFile(BUCKET_ID!, ID.unique(), imageFile);
    }

    const updatedProfileData = {
      doctorName,
      clinicAddress,
      clinicPhone,
      clinicTiming,
      imageId: file?.$id || null,
      imageUrl: file
        ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
        : null,
    };

    console.log(updatedProfileData); // Log the data for debugging

    // Update the doctor's profile in the database
    const updatedDoctor = await databases.updateDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      doctorId,
      updatedProfileData
    );

    return updatedDoctor; // Return the updated doctor profile
  } catch (error) {  
    console.error("Error updating doctor profile:", error);
    throw error;
  }
};

export const updateDoctorImage = async (doctorId: string, imageUrl: string) => {
  try {
    // Fetch the doctor document by doctorId  
    const doctor = await getDoctorById(doctorId);   

    // Use the Appwrite-generated document ID ($id) to update the document
    const updatedDoctor = await databases.updateDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      doctor.$id, // Use the document's Appwrite ID here
      {
        image: imageUrl,
      }
    );

    return updatedDoctor;
  } catch (error) {
    console.error("Error updating doctor image:", error);
    throw error;
  }
};