"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Doctor {
  doctorName: string;
  clinicAddress: string;
  clinicPhone: string;
}

const AppointmentModal = ({ open, onClose, selectedDoctor }: { open: boolean, onClose: () => void, selectedDoctor: Doctor | null }) => {   
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");    
  const router = useRouter();

  const handleSubmit = () => {  
    if (selectedDoctor && date && time && reason) {
      const query = new URLSearchParams({
        doctorName: selectedDoctor.doctorName,
        clinicAddress: selectedDoctor.clinicAddress,
        clinicPhone: selectedDoctor.clinicPhone,
        appointmentDate: date,
        appointmentTime: time,
        reason,
        fees: "100", // Example fee
      });
      router.push(`/summary?${query.toString()}`);
      onClose();
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white shadow-lg rounded-lg w-[90%] sm:w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Book Appointment</DialogTitle>
          <DialogDescription className="text-sm">Fill out the details below to book your appointment.</DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Reason</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for appointment"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Comments (Optional)</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Additional comments"
            />
          </div>

          <Button onClick={handleSubmit} className="bg-blue-600 text-white w-full">Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;  