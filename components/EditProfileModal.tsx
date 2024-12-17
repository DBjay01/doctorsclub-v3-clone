// components/EditProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateDoctorProfile, getDoctorById, updateDoctorProfilee } from "@/lib/actions/doctor.actions"; // Import your update function
import { toast } from "react-toastify";

interface EditProfileModalProps {
  doctorId?: string; // Make doctorId optional
  onClose: () => void;
  isOpen: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ doctorId, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    doctorName: "",
    specialty: "",
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) return; // Return if doctorId is not provided
      try {
        const doctorData = await getDoctorById(doctorId); // Fetch the doctor data
        // Map the fetched data to the formData state
        setFormData({
          clinicName: doctorData.clinicName,
          clinicAddress: doctorData.clinicAddress,
          clinicPhone: doctorData.clinicPhone,
          doctorName: doctorData.doctorName,
          specialty: doctorData.specialty,
        });
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    if (isOpen) {
      fetchDoctorData();
    }
  }, [isOpen, doctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!doctorId) throw new Error("Doctor ID is required"); // Ensure doctorId is present
      console.log("Updating doctor with ID:", doctorId);
      await updateDoctorProfilee({ doctorId, ...formData }); // Call your update function
      toast.success("Profile updated successfully!");
      onClose(); // Close the modal
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent >
        {/* Form container with scrollbar */}
        <div className="w-full max-w-lg p-8 bg-white border-t border-l rounded-lg shadow-lg border-b-4 border-r-4 border-black md:max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">
            Edit Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="doctorName" className="block mb-2 font-semibold text-black">
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
                <label htmlFor="specialty" className="block mb-2 font-semibold text-black">
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
                <label htmlFor="clinicName" className="block mb-2 font-semibold text-black">
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
                <label htmlFor="clinicAddress" className="block mb-2 font-semibold text-black">
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
                <label htmlFor="clinicPhone" className="block mb-2 font-semibold text-black">
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

            <div className="flex justify-center">
              <Button type="submit" className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;



