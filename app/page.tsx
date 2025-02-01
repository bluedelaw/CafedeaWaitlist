"use client";

import { WaitlistCard } from "@/components/WaitlistCard";
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from "@/firebaseConfig";
import { useEffect, useState } from "react";

export default function Page() {
  const [waitlist, setWaitlist] = useState<any[]>([]);

  useEffect(() => {
    const fetchWaitlistData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "waitlist"));
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          dateAdded: doc.data().dateAdded.toDate(),
        }));
        setWaitlist(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchWaitlistData();
  }, []);

  const handleSave = async (id: string, updatedFields: any) => {
    try {
      const waitlistRef = doc(db, "waitlist", id);
      await updateDoc(waitlistRef, updatedFields);
      setWaitlist((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, ...updatedFields } : entry))
      );
    } catch (error) {
      console.error("Error saving changes: ", error);
    }
  };

  const handleCancel = () => {
    // Logic for handling cancel, if needed (e.g., updating state or resetting UI).
  };

  const handleDelete = async (id: string) => {
    try {
      const waitlistRef = doc(db, "waitlist", id);
      await deleteDoc(waitlistRef);
      setWaitlist((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry: ", error);
    }
  };

  return (
    <div className="bg-gray-600 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Waitlist Management</h1>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-300">Waitlist:</h2>
          <div className="mt-4">
            {waitlist.length > 0 ? (
              waitlist
                .sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime())
                .map((entry, index) => (
                  <WaitlistCard
                    key={entry.id}
                    id={entry.id}
                    position={index + 1}
                    firstName={entry.firstName}
                    lastName={entry.lastName}
                    phone={entry.phone}
                    dateAdded={entry.dateAdded}
                    partySize={entry.partySize}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                  />
                ))
            ) : (
              <p className="text-gray-400">No entries available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
