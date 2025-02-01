"use client";

import {WaitlistCard} from "@/components/WaitlistCard";
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
      await deleteDoc(waitlistRef); // Delete the document from Firestore
      setWaitlist((prev) => prev.filter((entry) => entry.id !== id)); // Remove from local state
    } catch (error) {
      console.error("Error deleting entry: ", error);
    }
  };

  return (
    <>
      <div className="bg-red-800">
        <h1>Title</h1>
      </div>

      <div className="bg-blue-800">
        <h2>Waitlist:</h2>
        <div className="space-y-4">
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
            <p>No entries.</p>
          )}
        </div>
      </div>
    </>
  );
}
