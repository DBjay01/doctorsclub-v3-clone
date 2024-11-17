import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPatient } from "@/lib/actions/patient.actions";
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer

// Import the CSS styles for react-toastify
import 'react-toastify/dist/ReactToastify.css';

interface AddPatientDialogProps {
  doctorId: string;
}

const AddPatientDialog = ({ doctorId }: AddPatientDialogProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setName("");
    setAddress("");
    setPhone("");
    setReason("");
    setNotes("");
    setGender("male"); // Reset gender to default
    setSuccess(false);
    setOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    // Validate required fields
    if (!name || !address || !phone || !reason) {
      toast.error("Please fill in all required fields."); // Show toast message
      setLoading(false);
      return;
    }

    try {
      await addPatient({ name, address, phone, reason, notes, gender }, doctorId); // Pass notes and gender
      setSuccess(true);
      setOpen(false);
      window.dispatchEvent(new Event('patientAdded'));
      toast.success("Patient added successfully!"); // Success toast
    } catch (error) {
      console.error("Failed to add patient:", error);
      toast.error("Error adding patient!"); // Error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black" onClick={handleOpen}>
          + Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] bg-gray-900 text-white rounded-lg shadow-lg"
        style={{ backgroundColor: '#0e0e0e', color: '#fff' }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-200">Add New Patient</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter patient details and save to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Existing Input Fields */}
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-gray-800 text-white"
              style={{ backgroundColor: '#1b1b1b', color: '#fff', border: '1px solid #333' }}
            />
          </div>
          {/* Address */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right text-gray-300">
              Address
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-3 bg-gray-800 text-white"
              style={{ backgroundColor: '#1b1b1b', color: '#fff', border: '1px solid #333' }}
            />
          </div>
          {/* Phone Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-gray-300">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3 bg-gray-800 text-white"
              style={{ backgroundColor: '#1b1b1b', color: '#fff', border: '1px solid #333' }}
            />
          </div>
          {/* Reason */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right text-gray-300">
              Reason
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3 bg-gray-800 text-white"
              style={{ backgroundColor: '#1b1b1b', color: '#fff', border: '1px solid #333' }}
            />
          </div>

          {/* Gender Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-300">Gender</Label>
            <div className="col-span-3 flex items-center space-x-4">
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="mr-2"
                />
                <label htmlFor="male" className="text-gray-300">Male</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="mr-2"
                />
                <label htmlFor="female" className="text-gray-300">Female</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  checked={gender === "other"}
                  onChange={() => setGender("other")}
                  className="mr-2"
                />
                <label htmlFor="other" className="text-gray-300">Other</label>
              </div>
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right text-gray-300">
              Comments (optional)
            </Label> 
            <textarea  
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3 bg-gray-800 text-white h-24"
              style={{ backgroundColor: '#1b1b1b', color: '#fff', border: '1px solid #333' }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            type="submit"
            disabled={loading || success}
            className={`bg-blue-700 text-white ${success ? "bg-green-500" : ""}`}
          >
            {loading ? "Saving..." : success ? "Saved" : "Save Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <ToastContainer />
    </Dialog>  
  );
};

export default AddPatientDialog;   